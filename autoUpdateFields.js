function autoUpdateFields(triggerField, valueField, updateValue, event) {
  var timezone = "GMT+1";
  var timestamp_format = "dd-MM-yyyy HH:mm:ss"; // Timestamp Format. 
  var sheet = event.source.getSheetByName('data'); //Name of the sheet where you want to run this script.
  
  
  var sheet = event.source.getSheetByName('data');

  var actRng = event.source.getActiveRange();
  var editColumn = actRng.getColumn();
  var index = actRng.getRowIndex();
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues();

  var valueCol = headers[0].indexOf(valueField);
  var triggerCol = headers[0].indexOf(triggerField); triggerCol = triggerCol+1;

  if (valueCol > -1 && index > 1 && editColumn == triggerCol) { 
    var cell = sheet.getRange(index, valueCol + 1);
    updateValue = updateValue.replace(/%/g,index);
    var date = Utilities.formatDate(new Date(), timezone, timestamp_format);
    
    if (updateValue == 'timestamp') {
      cell.setValue(date)
    } else {
      cell.setFormula(updateValue);
    };
    
  }
}

function onEdit(event)
{ 
  autoUpdateFields('Task', 'DueDt', '=TODAY()', event)
  autoUpdateFields('Task', 'Dleft', '=A%-TODAY()', event)
  autoUpdateFields('Task', 'Priority', '=(if(isblank(F%);5;if(F%=0;1;F22))+if(isblank(E%);5;if(E%=0;1;E%)))*if(B%=0;1;B%+1)', event)
  autoUpdateFields('Task', 'CreatedDt', 'timestamp', event)
  autoUpdateFields('Status', 'CompletedDt', 'timestamp', event)
  
  
}

