Date.prototype.addDays = function(days) {
  var date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
};

var startRows = {
  ACQ: 4,
  VD: 5,
  MGM: 6,
  "Pre-2-Post": 7,
  others: 8
};

var kpiColors = {
  ACQ: "red",
  VD: "green",
  MGM: "blue",
  "Pre-2-Post": "yellow",
  others: "grey"
};

function createGantt() {
  // clear current gantt before processing data
  SpreadsheetApp.getActive()
    .getSheetByName("gantt")
    .getRange(startRows.ACQ, 1, startRows.others - startRows.ACQ, 53 + 3)
    .clear();

  // process data
  var data = SpreadsheetApp.getActiveSpreadsheet()
    .getRangeByName("data")
    .getValues();
  var numHeaders = 1;
  for (var i = numHeaders; i < data.length; i++) {
    var startDate = data[i][0];
    var endDate = data[i][1];
    var name = data[i][2];
    var notes = data[i][3];

    // only draw if name contains campaign
    // only draw if name contains following KPI's
    var isCampaign = name.match(/campaign/gi);
    var kpiFound = name.match(/(ACQ|VD|MGM|Pre-2-Post)/g);

    if (isCampaign && kpiFound) {
      Logger.log("Processing: " + name);

      // rows are split based on kpi
      var kpi = kpiFound[0];
      var startRow = startRows[kpi];
      drawGantt(startDate, endDate, name, notes, startRow);
    }
  }
}

function createNote(start, end, name, notes) {
  return 'Startdate: '+start+'\nEnddate: '+end+'\nCampaign:'+name+'\nNotes:'+notes;
}

function drawGantt(start, end, name, notes, startRow) {
  // get the start and end column
  var item = getGanttCol(start, end);
  var kpi = name.match(/(ACQ|VD|MGM|Pre-2-Post)/g)[0];

  var startColumn = item.startCol;
  var numRows = 1;
  var numColumns = item.endCol - item.startCol + 1;
  var note = createNote(start, end, name, notes);

  Logger.log(startRow);
  Logger.log(startColumn);
  Logger.log(numRows);
  Logger.log(numColumns);

  // merge the columns and add the name and formatting
  var range = SpreadsheetApp.getActive()
    .getSheetByName("gantt")
    .getRange(startRow, startColumn, numRows, numColumns);
  range
    .merge()
    .setValue(name)
    .setBackground(kpiColors[kpi])
    .setFontColor("white")
    .setHorizontalAlignment("Center")
    .setNote(note);
}

function getGanttCol(start, end) {
  // get the start and end column for the chart and create object for it
  var dateCols = SpreadsheetApp.getActiveSpreadsheet()
    .getRangeByName("dates")
    .getValues()[0];
  var startColGantt;
  var endColGantt;

  for (var i = 0; i < dateCols.length; i++) {
    if (start >= dateCols[i] && start < dateCols[i + 1]) {
      startColGantt = i;
    }
    if (dateCols[i] <= end && end > dateCols[i - 1]) {
      endColGantt = i;
    }
  }

  return { startCol: startColGantt + 1, endCol: endColGantt + 1 };
}
