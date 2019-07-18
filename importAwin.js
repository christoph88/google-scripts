function monthDiff(d1, d2) {
    var months;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth() + 1;
    months += d2.getMonth();
    return months <= 0 ? 0 : months;
}

Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}


function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}

function importAwin(start, end, accessToken) {
  //samples for testing
  //var start = '2019-05-10';
  //var end = '2019-07-10';
  
  var startYear = start.substr(0, 4);
  var startMonth = start.substr(5, 2);
  var startDay = 1;

  var endYear = end.substr(0, 4);
  var endMonth = end.substr(5, 2);
  var endDay = 1;

  // javascript months are enumerated from 0
  var startDate = new Date(startYear, startMonth-1, startDay);
  var endDate = new Date(endYear, endMonth-1, endDay);
  
  // max 31 days accepted by the api
  var amountOfMonths = monthDiff(startDate, endDate)+1;

  var arr = [];

  // loop through the months
  for (var i = 0; i <= amountOfMonths; i++) {
    Logger.log(i);
    Logger.log(i === 0);
    var loopStart = new Date(startDate);
    loopStart.setMonth(startDate.getMonth()+i);

    var loopEnd = new Date(startDate);
    loopEnd.setMonth(startDate.getMonth()+i+1);
    loopEnd.addDays(-1);

    arr = arr.concat(ImportJSON("https://api.awin.com/advertisers/8431/transactions/?startDate="+formatDate(loopStart)+"T00%3A00%3A00&endDate="+formatDate(loopEnd)+"T00%3A00%3A00&timezone=UTC&accessToken="+accessToken));

  }

  Logger.log(arr);
  
  return arr;

}

