function Copy() {
  var sss = SpreadsheetApp.getActiveSpreadsheet(); //replace with source ID
  var ss = sss.getSheetByName("Sheet1"); //replace with source Sheet tab name
  var range = ss.getActiveRange(); //assign the range you want to copy
  var width = range.getWidth();
  var height = range.getHeight();
  var data = range.getValues();

  var ts = sss.getSheetByName("data"); //replace with destination Sheet tab name
  ts.getRange(ts.getLastRow() + 1, 1, height, width).setValues(data); //you will need to define the size of the copied data see getRange()
}

function onOpen(e) {
  SpreadsheetApp.getUi()
    .createMenu("Scripts")
    .addItem("Copy values to sheet", "Copy")
    .addToUi();
}
