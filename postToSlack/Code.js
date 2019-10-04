function doGet() {
  var t = HtmlService.createTemplateFromFile('index');
  t.data = SpreadsheetApp
  .getActive()
  .getSheetByName('Form Responses')
  .getDataRange()
  .getValues().reverse();
  
  t.headers = SpreadsheetApp.getActive().getRangeByName('headers').getValues();
  
  return t.evaluate();
}