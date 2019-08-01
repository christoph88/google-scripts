function convertToDate(text) {
  text = text.toString();

  var year = text.substring(0, 4);
  var month = text.substring(4, 6);
  var day = text.substring(6, 8);

  // javascript counts months starting from 0
  var month = month - 1;

  var date = new Date(year, month, day);

  return date;
}

function getCalendar(id, start, end) {
  // Determines how many events are happening in the next two hours.
  var now = new Date();
  var twoHoursFromNow = new Date(now.getTime() + (20 * 60 * 60 * 1000));
  //var calendar = CalendarApp.getCalendarById(íd);
  var calendar = CalendarApp.getDefaultCalendar();
  var events = calendar.getEvents(now, twoHoursFromNow);
  Logger.log('Number of events: ' + events.length);
  Logger.log(events[0].getTitle());

}

