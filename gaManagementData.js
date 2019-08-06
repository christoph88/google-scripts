/**
 * Lists Analytics accounts.
 */
var accountId = 3356674;
var webPropertyId = 'UA-3356674-58';

function listCustomDimensions() {
  var spreadsheet = SpreadsheetApp.getActive();
  var sheet = spreadsheet.getActiveSheet();
  var request = Analytics.Management.CustomDimensions.list(accountId, webPropertyId);
  
  if (request.items && request.items.length) {
    for (var i = 0; i < request.items.length; i++) {
      var row = request.items[i];
  
      sheet.appendRow(row);
    }
  } else {
    Logger.log('No accounts found.');
  }
}


