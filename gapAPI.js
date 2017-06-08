function onOpen(e) {
  SpreadsheetApp.getUi()
    .createMenu('Google Analytics')
    .addItem('Get statistics', 'readAndWriteRows')
    .addToUi();
}

var spreadsheet = SpreadsheetApp.getActiveSpreadsheet(); 

/**
 * Retrieves all the rows in the defined spreadsheet that contain data and logs the
 * values for each row.
 * For more information on using the Spreadsheet API, see
 * https://developers.google.com/apps-script/service_spreadsheet
 */
function readAndWriteRows() {

  var sheetName = spreadsheet.getRangeByName('sheetName').getValues();
  var sheet = spreadsheet.getSheetByName(sheetName);
  var header = [['Newusers','Percentnewsessions','Sessions','Bouncerate','Avgsessionduration','Pagevalue','Pageviews','Timeonpage','Exits']];
  
  var rows = sheet.getDataRange();
  var numRows = rows.getNumRows();
  var values = rows.getValues();
  
  // setup colNumber which contains the url in the row output
  var URLcolNumber = spreadsheet.getRangeByName('URLcolNumber').getValues()-1; // -1 because here we are working on an array
  var destColNumber = spreadsheet.getRangeByName('destColNumber').getValues();
  //var URLcolNumber = 1;
  //var destColNumber = 4;

  for (var i = 0; i <= numRows - 1; i++) {
    var row = values[i];
    
    // setup the row where the values need to be set
    var destRowNumber = i;
   
    
    // push api data to the correct range
    // getRange(row, column, numRows, numColumns)

    if ( i == 0) {
      // set header on the first row
      sheet.getRange(destRowNumber+1, destColNumber,1,header[0].length).setValues(header); 
    } else {
      var processed = processRows(row, URLcolNumber);
      sheet.getRange(destRowNumber+1, destColNumber,1,processed[0].length).setValues(processed); 
    }

  }
};

function processRows(row, URLcolNumber) {
  Logger.log(URLcolNumber);
  Logger.log(row);

  // api setup 
  var accessToken = spreadsheet.getRangeByName('accessToken').getValues();

  // replace website name in searchable url
  var websites = new RegExp('http://www.(centerparcs.be|sunparks|pierreetvacances).(com|be|fr|de|nl)','gi');
  var url = row[URLcolNumber].replace(websites,'');

  var apiEndpoint = 'https://www.googleapis.com/analytics/v3/data/ga?'
    +'ids=ga%3A109751388'
    +'&start-date=7daysAgo'
    +'&end-date=yesterday' 
    +'&metrics=ga%3AnewUsers%2Cga%3ApercentNewSessions%2Cga%3Asessions%2Cga%3AbounceRate%2Cga%3AavgSessionDuration%2Cga%3ApageValue%2Cga%3Apageviews%2Cga%3AtimeOnPage%2Cga%3Aexits'
    +'&dimensions=ga%3ApagePath'
    +'&sort=-ga%3Asessions'
    +'&filters=ga%3ApagePath%3D~'+url 
    +'&access_token='+accessToken 
    +'&prettyPrint=true'

  var result = ImportJSON(apiEndpoint, "/totalsForAllResults", 'noHeaders');

  return result;

};
