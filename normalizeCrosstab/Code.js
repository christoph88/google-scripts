/**
 * Converts a crosstab table to a normalized table.
 *
 * @param  {table}  range The table you want to normalize.
 * @param  {column}  number The column where the dynamic data starts.
 * @return {newRows} The normalized table.
 *
 * @customfunction
 */
function normalizeCrosstab(table, column) {
  var numRows = table.length;
  var values = table;
  var firstDataCol = column;
  var dataCols = values[0].slice(firstDataCol-1);
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
  return newRows;
};