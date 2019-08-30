// Put your Slack webhook here, make sure its connected to the correct channel
var SLACK_WEBHOOK_POST_URL = SpreadsheetApp.getActiveSpreadsheet().getRangeByName('webhook').getValue();
var SLACK_WEBHOOK_TEST_URL = SpreadsheetApp.getActiveSpreadsheet().getRangeByName('webhookdmz').getValue();

function onSubmit(entry) {
  // Get item submitted
  var response = entry.namedValues;
  Logger.log(response);
  sendToSlack(response);
}

function testSlack() {
  var response = {"Goal - Pre2Post": [],
                  "Goal - Acquisition": ["enter_onboarding_funnel", "request_simcard"],
                  "End date": ["30/08/2019"],
                  "Audiences": ["everybody"],
                  "Launch date": ["29/08/2019"],
                  "Campaign name": ["this is the last test"],
                  "Product": ["Acquisition"],
                  "Goal - Viking Deals": [],
                  "Campaign goal": [], 
                  "Timestamp": ["29/08/2019 09:17:18"],
                  "Your email": [],
                  "Type": ["Tactical"],
                  "Target": ["5000 request"],
                  "Assets": ["Search keywords", "Display", "Video", "Social post", "Blogpost", "Landing page"],
                  "Goals": [],
                  "Goal - other": [],
                  "What do you want to achieve and how do you want to do this?": ["i want to do this"],
                  "What message do you want to deliver to the target audience?": ["the best message"],
                  "Goal - Member gets Member": [],
                  "Email Address": ["test@mobilevikings.be"]};
  sendToSlack(response, true);
}


function sendToSlack(response, test) {
    // build message
    if (test) {
    var SLACK_WEBHOOK_POST_URL = SLACK_WEBHOOK_TEST_URL;
    }

  var text = {blocks: [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text:
          "You have a new *<https://docs.google.com/forms/d/1wHv6pmmon6wPziT59b2wp-njEoHJ7fSXH22-zOGjCTs/edit?no_redirect#responses|Go to market request>*"
      }
    },
    {
      type: "section",
      fields: [
        {
          type: "mrkdwn",
          text: "*Campaign:*\n" + response["Campaign name"].join("\n")
        },
        {
          type: "mrkdwn",
          text: "*Launch date:*\n" + response["Launch date"].join("\n")
        },
        {
          type: "mrkdwn",
          text: "*End date:*\n" + response["End date"].join("\n")
        },
        {
          type: "mrkdwn",
          text: "*Target:*\n" + response["Target"].join("\n")
        },
        {
          type: "mrkdwn",
          text: "*Assets:*\n" + response["Assets"].join("\n")
        },
        {
          type: "mrkdwn",
          text:
            "*Goal:*\n" +
            response[
              "What do you want to achieve and how do you want to do this?"
            ].join("\n")
        }
      ]
    }
  ]};

  // Stringify payload
  var payload = {
    payload: JSON.stringify(text)
  };

  // Build request
  var options = {
    method: "post",
    payload: payload
  };

  // Send to Slack
   UrlFetchApp.fetch(SLACK_WEBHOOK_POST_URL, options);
}

