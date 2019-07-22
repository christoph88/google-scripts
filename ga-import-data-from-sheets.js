// Add a custom menu to the active spreadsheet, including a separator and a sub-menu.
function onOpen(e) {
  SpreadsheetApp.getUi()
      .createMenu('Upload data')
      .addItem('Upload this sheet', 'uploadData')
      .addToUi();
}

function uploadData() {
  var accountId = "3356674";
  var webPropertyId = "UA-3356674-58";
  var customDataSourceId = "thKg27PmReOZitLfalOrsA";
  var ss = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var maxRows = ss.getLastRow();
  var maxColumns = ss.getLastColumn();
  var data = [];
  for (var i = 1; i <= maxRows;i++) {
    data.push(ss.getRange([i], 1,1, maxColumns).getValues());
  }
  var newData = data.join("\n");
  var blobData = Utilities.newBlob(newData, "application/octet-stream", "GA import data");
  Logger.log(blobData.getDataAsString())
  try {
    var upload = Analytics.Management.Uploads.uploadData(accountId, webPropertyId, customDataSourceId, blobData);
    SpreadsheetApp.getUi().alert("Uploading: OK");
  }
  catch(err) {
    SpreadsheetApp.getUi().alert(err);
  }
}
