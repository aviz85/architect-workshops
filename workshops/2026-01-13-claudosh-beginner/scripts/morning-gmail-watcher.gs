/**
 * Morning Payment Email Watcher
 *
 * This Google Apps Script monitors Gmail for payment notifications from Morning (חשבונית ירוקה)
 * and automatically calls the webhook to register paid participants.
 *
 * Setup:
 * 1. Go to https://script.google.com/
 * 2. Create a new project
 * 3. Paste this code
 * 4. Run setup() once to create the trigger
 * 5. Authorize the permissions
 *
 * The script will check for new Morning emails every 5 minutes.
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
  triggers.forEach(trigger => {
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
 * Main function - checks for unprocessed Morning emails
 */
function checkMorningEmails() {
  const query = `from:${MORNING_SENDER} -label:${PROCESSED_LABEL} newer_than:1d`;
  const threads = GmailApp.search(query, 0, 10);

  Logger.log(`Found ${threads.length} unprocessed Morning emails`);

  const processedLabel = GmailApp.getUserLabelByName(PROCESSED_LABEL);

  for (const thread of threads) {
    const messages = thread.getMessages();
    for (const message of messages) {
      const body = message.getPlainBody();
      const subject = message.getSubject();

      // Check if it's a payment notification
      if (body.includes('רכשו ממך') && body.includes('שם מלא:')) {
        const parsed = parsePaymentEmail(body);

        if (parsed) {
          Logger.log(`Processing: ${parsed.name} (${parsed.email})`);

          // Extract workshop keyword from email
          const workshopMatch = body.match(/סדנת[״"]([^״"]+)[״"]/);
          const workshopKeyword = workshopMatch ? workshopMatch[1] : '';

          // Call webhook
          const result = callWebhook(parsed.name, parsed.email, parsed.phone, workshopKeyword);
          Logger.log(`Webhook result: ${JSON.stringify(result)}`);
        }
      }
    }

    // Mark thread as processed
    thread.addLabel(processedLabel);
  }
}

/**
 * Parse payment email to extract participant details
 */
function parsePaymentEmail(body) {
  const nameMatch = body.match(/שם מלא:\s*(.+)/);
  const emailMatch = body.match(/מייל:\s*(\S+)/);
  const phoneMatch = body.match(/טלפון:\s*(\S+)/);

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
  const payload = {
    name: name,
    email: email,
    phone: phone,
    workshopKeyword: workshopKeyword
  };

  const options = {
    method: 'post',
    contentType: 'application/json',
    headers: {
      'x-api-key': WEBHOOK_API_KEY
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  try {
    const response = UrlFetchApp.fetch(WEBHOOK_URL, options);
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
  const query = `from:${MORNING_SENDER} newer_than:7d`;
  const threads = GmailApp.search(query, 0, 1);

  if (threads.length === 0) {
    Logger.log('No Morning emails found in the last 7 days');
    return;
  }

  const message = threads[0].getMessages()[0];
  const body = message.getPlainBody();

  Logger.log('Email body:');
  Logger.log(body);

  const parsed = parsePaymentEmail(body);
  Logger.log('Parsed:');
  Logger.log(JSON.stringify(parsed));
}
