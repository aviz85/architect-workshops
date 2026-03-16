/**
 * Morning Payment Email Watcher
 *
 * Monitors Gmail for payment notifications from Morning (חשבונית ירוקה)
 * and automatically calls the webhook to register paid participants.
 */

// Configuration
const WEBHOOK_URL = 'https://claudosh.master-x.co.il/api/morning-webhook';
const WEBHOOK_API_KEY = 'mw_aviz_2026_secret';
const MORNING_SENDER = 'notify@morning.co';
const PROCESSED_LABEL = 'Morning-Processed';

/**
 * Setup function - run once to create the trigger
 */
function setup() {
  // Create label if doesn't exist
  let label = GmailApp.getUserLabelByName(PROCESSED_LABEL);
  if (!label) {
    label = GmailApp.createLabel(PROCESSED_LABEL);
    Logger.log('Created label: ' + PROCESSED_LABEL);
  }

  // Remove existing triggers
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(function(trigger) {
    if (trigger.getHandlerFunction() === 'checkMorningEmails') {
      ScriptApp.deleteTrigger(trigger);
    }
  });

  // Create new trigger - check every 5 minutes
  ScriptApp.newTrigger('checkMorningEmails')
    .timeBased()
    .everyMinutes(5)
    .create();

  Logger.log('Setup complete! Trigger created to run every 5 minutes.');
}

/**
 * Get set of already processed email+workshop combinations
 */
function getProcessedSet() {
  var props = PropertiesService.getScriptProperties();
  var data = props.getProperty('processedEmails');
  return data ? JSON.parse(data) : {};
}

/**
 * Mark email+workshop as processed
 */
function markAsProcessed(email, workshop) {
  var key = email + '|' + workshop;
  var processed = getProcessedSet();
  processed[key] = Date.now();

  // Clean old entries (older than 7 days)
  var weekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
  for (var k in processed) {
    if (processed[k] < weekAgo) {
      delete processed[k];
    }
  }

  PropertiesService.getScriptProperties().setProperty('processedEmails', JSON.stringify(processed));
}

/**
 * Check if email+workshop was already processed
 */
function wasAlreadyProcessed(email, workshop) {
  var key = email + '|' + workshop;
  var processed = getProcessedSet();
  return processed.hasOwnProperty(key);
}

/**
 * Main function - DISABLED: removes all triggers and stops
 */
function checkMorningEmails() {
  // AUTO-DISABLE: Remove all triggers and stop
  var triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(function(trigger) {
    ScriptApp.deleteTrigger(trigger);
  });
  Logger.log('DISABLED: All triggers removed. Morning watcher stopped.');
  return;

  // Original code below (unreachable)
  var query = 'from:' + MORNING_SENDER + ' newer_than:1d';
  var threads = GmailApp.search(query, 0, 10);

  Logger.log('Found ' + threads.length + ' Morning emails to check');

  var processedLabel = GmailApp.getUserLabelByName(PROCESSED_LABEL);

  for (var i = 0; i < threads.length; i++) {
    var thread = threads[i];
    var messages = thread.getMessages();

    for (var j = 0; j < messages.length; j++) {
      var message = messages[j];
      var body = message.getPlainBody();

      // Check if it's a payment notification
      if (body.indexOf('רכשו ממך') !== -1 && body.indexOf('שם מלא:') !== -1) {
        var parsed = parsePaymentEmail(body);

        if (parsed) {
          // Extract workshop keyword from email - try multiple patterns
          var workshopKeyword = '';

          // Pattern 1: סדנת"שם" or סדנת״שם״ (with quotes)
          var quotedMatch = body.match(/סדנת[״"]([^״"]+)[״"]/);
          if (quotedMatch) {
            workshopKeyword = quotedMatch[1];
          } else {
            // Pattern 2: סדנת שם (without quotes) - capture until newline or dash
            var unquotedMatch = body.match(/סדנת\s+([^\n\-]+)/);
            if (unquotedMatch) {
              workshopKeyword = unquotedMatch[1].trim();
            }
          }

          // Normalize: "0 חיכוך" -> "אפס חיכוך"
          workshopKeyword = workshopKeyword.replace(/^0\s+/, 'אפס ');

          // Check if already processed (prevents duplicates!)
          if (wasAlreadyProcessed(parsed.email, workshopKeyword)) {
            Logger.log('SKIP (already processed): ' + parsed.name + ' (' + parsed.email + ')');
            continue;
          }

          Logger.log('Processing: ' + parsed.name + ' (' + parsed.email + ') for ' + workshopKeyword);

          // Call webhook
          var result = callWebhook(parsed.name, parsed.email, parsed.phone, workshopKeyword);
          Logger.log('Webhook result: ' + JSON.stringify(result));

          // Mark as processed IMMEDIATELY after successful webhook
          markAsProcessed(parsed.email, workshopKeyword);
        }
      }
    }

    // Also add label (backup)
    thread.addLabel(processedLabel);
  }
}

/**
 * Parse payment email to extract participant details
 */
function parsePaymentEmail(body) {
  var nameMatch = body.match(/שם מלא:\s*(.+)/);
  var emailMatch = body.match(/מייל:\s*(\S+)/);
  var phoneMatch = body.match(/טלפון:\s*(\S+)/);

  if (nameMatch && emailMatch && phoneMatch) {
    return {
      name: nameMatch[1].trim(),
      email: emailMatch[1].trim(),
      phone: phoneMatch[1].trim()
    };
  }

  return null;
}

/**
 * Call the webhook to register the participant
 */
function callWebhook(name, email, phone, workshopKeyword) {
  var payload = {
    name: name,
    email: email,
    phone: phone,
    workshopKeyword: workshopKeyword
  };

  var options = {
    method: 'post',
    contentType: 'application/json',
    headers: {
      'x-api-key': WEBHOOK_API_KEY
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  try {
    var response = UrlFetchApp.fetch(WEBHOOK_URL, options);
    return JSON.parse(response.getContentText());
  } catch (error) {
    Logger.log('Webhook error: ' + error.message);
    return { error: error.message };
  }
}

/**
 * Manual test function - process the most recent Morning email
 */
function testWithLatestEmail() {
  var query = 'from:' + MORNING_SENDER + ' newer_than:7d';
  var threads = GmailApp.search(query, 0, 1);

  if (threads.length === 0) {
    Logger.log('No Morning emails found in the last 7 days');
    return;
  }

  var message = threads[0].getMessages()[0];
  var body = message.getPlainBody();

  Logger.log('Email body:');
  Logger.log(body);

  var parsed = parsePaymentEmail(body);
  Logger.log('Parsed:');
  Logger.log(JSON.stringify(parsed));
}

/**
 * Remove all triggers (cleanup)
 */
function removeTriggers() {
  var triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(function(trigger) {
    ScriptApp.deleteTrigger(trigger);
  });
  Logger.log('All triggers removed');
}
