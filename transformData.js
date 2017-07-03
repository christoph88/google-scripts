function transformData() {
  var sheet = SpreadsheetApp.getActiveSheet();
  var data = sheet.getDataRange().getValues(); //read whole sheet
  var output = [];
  var headers = data.shift(); // get headers
  var empty = headers.shift(); //remove empty cell on the left
  var products = [];
  for (var d in data) {
    var p = data[d].shift(); //get product names in first column of each row
    products.push(p); //store
  }
  Logger.log("headers = " + headers);
  Logger.log("products = " + products);
  Logger.log("data only =" + data);
  for (var h in headers) {
    for (var p in products) {
      // iterate with 2 loops (headers and products)
      var row = [];
      row.push(headers[h]);
      row.push(products[p]);
      row.push(data[p][h]);
      output.push(row); //collect data in separate rows in output array
    }
  }
  Logger.log("output array = " + output);
  var ns = SpreadsheetApp.getActive().getSheets().length + 1;

  SpreadsheetApp.getActiveSpreadsheet()
    .insertSheet("New Sheet" + ns, ns)
    .getRange(1, 1, output.length, output[0].length)
    .setValues(output);
}
