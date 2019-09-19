function normalizeCrosstabb(table, column) {
  if (!really) {
    return start();
  }
  var sheet = SpreadsheetApp.getActiveSheet(); 
  var rows = sheet.getDataRange();
  var numRows = table.length;
  var values = table;
  var firstDataCol = SpreadsheetApp.getActiveRange().getColumn();
  var dataCols = values[0].slice(firstDataCol-1);

  var resultssheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("NormalizedResult");
  if (resultssheet != null) {
    SpreadsheetApp.getActive().deleteSheet(resultssheet);
  }
  var header = values[0].slice(0, firstDataCol - 1);

  var newRows = [];
  
  header.push("Field");
  header.push("Value");
  newRows.push(header);

  for (var i = 1; i <= numRows - 1; i++) {
    var row = values[i];
    for (var datacol = 0; datacol < dataCols.length; datacol ++) {
      newRow = row.slice(0, firstDataCol - 1); // copy repeating portion of each row
      newRow.push(values[0][firstDataCol - 1 + datacol]); // field name
      newRow.push(values[i][firstDataCol - 1 + datacol]); // field value
      newRows.push(newRow);
    }
  }
  var newSheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet("NormalizedResult");
  var r = newSheet.getRange(1,1,newRows.length, header.length);
  r.setValues(newRows);
};