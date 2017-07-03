/*Updated and maintain by internetgeeks.org*/

function onEdit(event) {
  var timezone = "GMT+1";
  var timestamp_format = "dd-MM-yyyy HH:mm:ss"; // Timestamp Format.
  var updateColName = "Task";
  var timeStampColName = "CreatedDt";
  var sheet = event.source.getSheetByName("data"); //Name of the sheet where you want to run this script.

  var actRng = event.source.getActiveRange();
  var editColumn = actRng.getColumn();
  var index = actRng.getRowIndex();
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues();
  var dateCol = headers[0].indexOf(timeStampColName);
  var updateCol = headers[0].indexOf(updateColName);
  updateCol = updateCol + 1;
  if (dateCol > -1 && index > 1 && editColumn == updateCol) {
    // only timestamp if 'Last Updated' header exists, but not in the header row itself!
    var cell = sheet.getRange(index, dateCol + 1);
    var date = Utilities.formatDate(new Date(), timezone, timestamp_format);
    cell.setValue(date);
  }

  var updateColName = "Status";
  var timeStampColName = "CompletedDt";

  var actRng = event.source.getActiveRange();
  var editColumn = actRng.getColumn();
  var index = actRng.getRowIndex();
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues();
  var dateCol = headers[0].indexOf(timeStampColName);
  var updateCol = headers[0].indexOf(updateColName);
  updateCol = updateCol + 1;
  if (dateCol > -1 && index > 1 && editColumn == updateCol) {
    // only timestamp if 'Last Updated' header exists, but not in the header row itself!
    var cell = sheet.getRange(index, dateCol + 1);
    var date = Utilities.formatDate(new Date(), timezone, timestamp_format);
    cell.setValue(date);
  }
}
