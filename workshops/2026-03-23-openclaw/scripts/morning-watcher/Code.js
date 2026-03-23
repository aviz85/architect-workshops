/**
 * Morning Payment Email Watcher - OpenClaw Workshop
 * סדנת מי מפחד מ-OpenClaw | 26.3.2026 (יום חמישי)
 *
 * Runs every 5 minutes via trigger.
 * Detects Morning payment emails → calls VPS webhook → sends WhatsApp + email to buyer.
 */

const WEBHOOK_URL = 'http://37.60.230.233:3031/morning-webhook';
const MORNING_SENDER = 'notify@morning.co';
const PROCESSED_LABEL = 'Morning-Processed';
const WORKSHOP_KEYWORD = 'OpenClaw';

function setup() {
  // Create label if missing
  if (!GmailApp.getUserLabelByName(PROCESSED_LABEL)) {
    GmailApp.createLabel(PROCESSED_LABEL);
    Logger.log('Created label: ' + PROCESSED_LABEL);
  }

  // Remove old triggers for this function
  ScriptApp.getProjectTriggers().forEach(function(t) {
    if (t.getHandlerFunction() === 'checkMorningEmails') {
      ScriptApp.deleteTrigger(t);
    }
  });

  // New trigger: every 5 minutes
  ScriptApp.newTrigger('checkMorningEmails')
    .timeBased()
    .everyMinutes(5)
    .create();

  Logger.log('Setup complete! Trigger created - runs every 5 minutes.');
}

function checkMorningEmails() {
  var query = 'from:' + MORNING_SENDER + ' newer_than:3d';
  var threads = GmailApp.search(query, 0, 20);
  Logger.log('Found ' + threads.length + ' Morning email threads');

  var processedLabel = GmailApp.getUserLabelByName(PROCESSED_LABEL);
  var processed = getProcessedSet();

  for (var i = 0; i < threads.length; i++) {
    var thread = threads[i];
    var messages = thread.getMessages();

    for (var j = 0; j < messages.length; j++) {
      var message = messages[j];
      var body = message.getPlainBody();

      // Only process payment notifications
      if (body.indexOf('רכשו ממך') === -1 || body.indexOf('שם מלא:') === -1) continue;

      var parsed = parsePaymentEmail(body);
      if (!parsed) continue;

      var key = parsed.email + '|openclaw';
      if (processed[key]) {
        Logger.log('SKIP (already processed): ' + parsed.name);
        continue;
      }

      Logger.log('Processing: ' + parsed.name + ' | ' + parsed.email + ' | ' + parsed.phone);

      var result = callWebhook(parsed.name, parsed.email, parsed.phone);
      Logger.log('Webhook result: ' + JSON.stringify(result));

      // Mark processed
      processed[key] = Date.now();
    }

    if (processedLabel) thread.addLabel(processedLabel);
  }

  saveProcessedSet(processed);
}

function parsePaymentEmail(body) {
  var nameMatch  = body.match(/שם מלא:\s*(.+)/);
  var emailMatch = body.match(/מייל:\s*(\S+)/);
  var phoneMatch = body.match(/טלפון:\s*(\S+)/);

  if (nameMatch && emailMatch && phoneMatch) {
    return {
      name:  nameMatch[1].trim(),
      email: emailMatch[1].trim(),
      phone: phoneMatch[1].trim()
    };
  }
  return null;
}

function callWebhook(name, email, phone) {
  var payload = { name: name, email: email, phone: phone };
  try {
    var response = UrlFetchApp.fetch(WEBHOOK_URL, {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    });
    return JSON.parse(response.getContentText());
  } catch (e) {
    Logger.log('Webhook error: ' + e.message);
    return { error: e.message };
  }
}

function getProcessedSet() {
  var data = PropertiesService.getScriptProperties().getProperty('processedEmails');
  var obj = data ? JSON.parse(data) : {};
  // Clean entries older than 14 days
  var cutoff = Date.now() - 14 * 24 * 60 * 60 * 1000;
  for (var k in obj) { if (obj[k] < cutoff) delete obj[k]; }
  return obj;
}

function saveProcessedSet(obj) {
  PropertiesService.getScriptProperties().setProperty('processedEmails', JSON.stringify(obj));
}

/** Manual test: parse the latest Morning email and preview without sending */
function testParseLatestEmail() {
  var threads = GmailApp.search('from:' + MORNING_SENDER + ' newer_than:7d', 0, 1);
  if (!threads.length) { Logger.log('No Morning emails found'); return; }
  var body = threads[0].getMessages()[0].getPlainBody();
  Logger.log('--- Email body ---\n' + body.slice(0, 800));
  Logger.log('--- Parsed ---\n' + JSON.stringify(parsePaymentEmail(body)));
}

/** Full manual test: fire webhook with your own details */
function testWithMyDetails() {
  var result = callWebhook('אביץ', 'avizmaeir@gmail.com', '0503973736');
  Logger.log('Result: ' + JSON.stringify(result));
}

function removeTriggers() {
  ScriptApp.getProjectTriggers().forEach(function(t) { ScriptApp.deleteTrigger(t); });
  Logger.log('All triggers removed');
}
