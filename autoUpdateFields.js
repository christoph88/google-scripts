function autoUpdateFields(params, triggerField, valueField, updateValue) {

  var valueCol = params.headers[0].indexOf(valueField);
  var triggerCol = params.headers[0].indexOf(triggerField); triggerCol = triggerCol+1;

  if (valueCol > -1 && params.index > 1 && params.editColumn == triggerCol) { 
    var cell = params.sheet.getRange(params.index, valueCol + 1);
    updateValue = updateValue.replace(/%/g,params.index);

    // do not overwrite CreatedDt

    var checkIfModifiedDt = params.headers[0][params.headers[0].indexOf(valueField)] == 'ModifiedDt';
    var checkIfCellEmpty = cell.getValue() == '';


    // only update when field is empty unless ModfiedDt
    if (checkIfCellEmpty && updateValue == 'timestamp') {
      cell.setValue(params.date)
    }
    
    if (checkIfCellEmpty && updateValue != 'timestamp') {
      cell.setFormula(updateValue);
    };

    if (!checkIfCellEmpty && checkIfModifiedDt) {
      cell.setValue(params.date)
    }
    
  }
}

function onEdit(event)
{ 

  var timezone = "GMT+1";
  var timestamp_format = "dd-MM-yyyy HH:mm:ss"; // Timestamp Format. 
  var date = Utilities.formatDate(new Date(), timezone, timestamp_format);
  var sheet = event.source.getSheetByName('data'); //Name of the sheet where you want to run this script.
  var actRng = event.source.getActiveRange();
  var editColumn = actRng.getColumn();
  var index = actRng.getRowIndex();
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues();

  var params = { 'timezone': timezone, 'timestamp_format': timestamp_format, 'date': date, 'sheet': sheet, 'actRng': actRng, 'editColumn': editColumn, 'index': index, 'headers': headers };

  autoUpdateFields(params, 'Task', 'DueDt', '=TODAY()')
  autoUpdateFields(params, 'Task', 'Dleft', '=A%-TODAY()')
  autoUpdateFields(params, 'Task', 'Priority', '=(if(isblank(F%);5;if(F%=0;1;F22))+if(isblank(E%);5;if(E%=0;1;E%)))*if(B%=0;1;B%+1)')
  autoUpdateFields(params, 'Task', 'CreatedDt', 'timestamp')
  autoUpdateFields(params, 'Task', 'ModifiedDt', 'timestamp')
  autoUpdateFields(params, 'Status', 'CompletedDt', 'timestamp')
  
  
}

