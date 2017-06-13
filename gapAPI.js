function test() {
  //var test = getGAPdata('/be-wl/france/fp_BF_vacances-domaine-les-bois-francs/itineraire');
  //Logger.log(test);
  
  var now = new Date();  
  spreadsheet.getRangeByName('lastProcessedDate').setValue(now);
}

function run() {
  // run is needed to check for correct weekday.
  var now = new Date();
  var weekday = now.getDay();
  var runday = 0;  // sunday = 0
  
  if ( weekday == runday ) {
    
    spreadsheet.getRangeByName('lastProcessedDate').setValue(now);
    
    Logger.log('Running readAndWriteRows function...');
    readAndWriteRows();
    
  } else {
    Logger.log('Today is: ' + weekday + ', the script runs on ' + runday + '.');
  }
}


// delete rows or continue by using not filled rows
// other accounts can be implented by making a conditional profileID

var spreadsheet = SpreadsheetApp.getActiveSpreadsheet(); 
var metrics = 'ga:sessions, ga:pageviews, ga:uniquePageviews, ga:avgTimeOnPage, ga:entrances, ga:bounces, ga:exits, ga:pageValue ';

// keep track of time the script is running to prevent it going over time
/* Based on https://gist.github.com/erickoledadevrel/91d3795949e158ab9830 */

function isTimeUp_(start) {
  var now = new Date();
  var maxMinutes = 1000*60*4.8
  return now.getTime() - start.getTime() > maxMinutes; // 5 minutes
}

function getGAPprofileID(pagepath) {
  return 'ga:109751388';
}


function getGAPdata(pagepath) {
  //var today = new Date();
  //var oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  //var startDate = Utilities.formatDate(oneWeekAgo, Session.getTimeZone(),'yyyy-MM-dd');
  //var endDate = Utilities.formatDate(today, Session.getTimeZone(),'yyyy-MM-dd');

  var startDate = '30daysAgo';
  var endDate = 'yesterday';
  var tableId  = getGAPprofileID(pagepath);
  var options = {
    'dimensions': 'ga:pagePath',
    'filters': 'ga:pagePath=~' + pagepath
  };
  var report = Analytics.Data.Ga.get(tableId, startDate, endDate, metrics,
    options);

  var output = report.totalsForAllResults;

  var header = [];
  var result = [];
  
  
  for (var key in output) {
    if (output.hasOwnProperty(key)) {
      header.push(key);
      result.push(output[key]);
    }
  }
  Logger.log('Header = ' + header.join('\t'));
  
  return result;

}

function processRows(row, URLcolNumber) {

  // replace website name in searchable url
  var websites = new RegExp('http://www.(centerparcs|sunparks|pierreetvacances).(com|be|fr|de|nl)','gi');
  var url = row[URLcolNumber].replace(websites,'');

  var result = [getGAPdata(url)];

  return result;

};

/**
 * Retrieves all the rows in the defined spreadsheet that contain data and logs the
 * values for each row.
 * For more information on using the Spreadsheet API, see
 * https://developers.google.com/apps-script/service_spreadsheet
 */
function readAndWriteRows() {

  var sheetName = spreadsheet.getRangeByName('sheetName').getValues();
  var sheet = spreadsheet.getSheetByName(sheetName);


  var rows = sheet.getDataRange();
  var values = rows.getValues();

  // setup colNumber which contains the url in the row output
  var URLcolNumber = spreadsheet.getRangeByName('URLcolNumber').getValue()-1; // -1 because here we are working on an array
  var destColNumber = spreadsheet.getRangeByName('destColNumber').getValue();
  var lastProcessedRow = spreadsheet.getRangeByName('lastProcessedRow');
  var numRows = rows.getNumRows();
  
  var start = new Date(); //define start of the script
  
  for (var i = lastProcessedRow.getValue(); i < numRows; i++) {
    

    // stop script when time is up and write last processed row to sheet
    // since there is a break we have to go one back.
    if (isTimeUp_(start)) {
      Logger.log("Time up");
      lastProcessedRow.setValue(i-1);
      break;
    }

    var row = values[i];

    // setup the row where the values need to be set
    // +1 since array starts at 0
    var destRowNumber = i+1;
    
    // do not overwrite header values
    // push api data to the correct range
    // getRange(row, column, numRows, numColumns)
    
    if ( destRowNumber == numRows ){
      // value of i+1 is set. The actual last processed row is one less because the value array starts at 0.
      // once the last row is processed we don't want this row to keep looping
      lastProcessedRow.setValue(i+1);
    };

    if ( row != undefined && destRowNumber > 1 ) {
      // process data if not first row
      var processed = processRows(row, URLcolNumber);
      sheet.getRange(destRowNumber, destColNumber,1,processed[0].length).setValues(processed); 
    }
    

  }
};

function resetLastProcessed() {
  var lastProcessedRow = spreadsheet.getRangeByName('lastProcessedRow');
  lastProcessedRow.setValue(0);
  Logger.log('Reset last processed rows');
}
