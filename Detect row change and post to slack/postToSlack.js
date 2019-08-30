// Put your Slack webhook here, make sure its connected to the correct channel
var SLACK_WEBHOOK_POST_URL = SpreadsheetApp.getActiveSpreadsheet().getRangeByName('webhook').getValue();
var SLACK_WEBHOOK_TEST_URL = SpreadsheetApp.getActiveSpreadsheet().getRangeByName('webhookdmz').getValue();

// created cache for saving changed rows
var cache = CacheService.getDocumentCache();

// sheet and header data
var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("data");
var headers = sheet.getRange("1:1").getValues();
var headerNum = headers[0].length;

// track changed rows
function onChange(e) {
  var currentCache = cache.get('changes') || '{"data": []}';
  var rowNum = e.range.getRow();
  var obj = JSON.parse(currentCache);

  obj.data.push(rowNum);

  cache.put('changes', JSON.stringify(obj));
  
  // show cache
  Logger.log(obj);
}

function testCache() {
  // cache cannot save arrays
  cache.put('changes', JSON.stringify({"data": [156,157]}));
  cacheToSlack('test');
}

function getCache() {
  // cache cannot save arrays
  Logger.log('getting cache:')
  Logger.log(JSON.parse(cache.get('changes')));
  Logger.log(cache.get('changes'));
}

// send all rows in cache to slack
function cacheToSlack(test) {
  if (!cache.get('changes')) {return true;}
  var cacheData = JSON.parse(cache.get('changes'));
  
  // only unique values
  var changes = cacheData.data.filter(function(item, pos) {
    return cacheData.data.indexOf(item) == pos;
  })
 
  for (var i = 0; i < changes.length; i++) {

    // get edit range
    var row = changes[i];   
    var rowValues = sheet.getRange(row, 1, 1, headerNum).getValues()[0];
    rowToObject(rowValues, test);
  }
  clearCache();

}

function rowToObject(row, test) {
  // check if row contains data
  if (row.join().length < 10) { return true; }
  // create data object with headers as keys
  var data = {};

  for (var i = 0; i < headerNum; ++i) {
    var header = headers[0][i];
    data[header] = row[i];
  }
  
  postToSlack(data, test);
}

function testSlack() {
  var data = {
    impact: "no onboarding possible",
    channel: "Website",
    dateTo: "",
    description: "Unlimited LP cookie error > when clicking on onboarding",
    where: "Experiment",
    learning: "test full funnel first with these kind of errors",
    dateFrom: "Tue Aug 27 00:00:00 GMT+02:00 2019"
  };

  postToSlack(data, 'test');
}

function postToSlack(data, test) {
  if (test === 'test') {
    var SLACK_WEBHOOK_POST_URL = SLACK_WEBHOOK_TEST_URL;
  }

  Logger.log('post to slack ' + data.description);
  // Create payload object
  var payloadObject = {
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text:
            "You have a new *<https://docs.google.com/spreadsheets/d/1OqpYm6RgAtvgHB_esc9HKiH6kK7OVnOX0iDp54Kxmvw/edit#gid=919012836|Change or learning>*"
        }
      },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: "*Channel:*\n" + data.channel
          },
          {
            type: "mrkdwn",
            text: "*Where:*\n" + data.where
          },
          {
            type: "mrkdwn",
            text: "*dateFrom:*\n" + data.dateFrom
          },
          {
            type: "mrkdwn",
            text: "*dateTo:*\n" + data.dateTo
          },
          {
            type: "mrkdwn",
            text: "*description:*\n" + data.description
          },
          {
            type: "mrkdwn",
            text: "*learning:*\n" + data.learning
          },
          {
            type: "mrkdwn",
            text: "*impact:*\n" + data.impact
          }
        ]
      }
    ]
  };

  // Stringify payload
  var payload = {
    payload: JSON.stringify(payloadObject)
  };

  // Build request
  var options = {
    method: "post",
    payload: payload
  };

  // Send to Slack
  UrlFetchApp.fetch(SLACK_WEBHOOK_POST_URL, options);
}

function clearCache() {
  Logger.log('clear cache');
  cache.remove('changes');
}

