function convertToDate(text) {
  
  text = text.toString();

  var year = text.substring(0,4);
  var month = text.substring(4,6);
  var day = text.substring(6,8);
  
  // javascript counts months starting from 0
  var month = month - 1
 
  var date = new Date(year, month, day);
  
  return date;
  
}
