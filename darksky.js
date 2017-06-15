function test() {
  var date = new Date()
  var test = unixTime(date);
  Logger.log(test);
}

function geocode(address) {

  // Gets the geographic coordinates for Times Square.
  var response = Maps.newGeocoder().geocode(address);
  for (var i = 0; i < response.results.length; i++) {
    var result = response.results[i];
    Logger.log('%s: %s, %s', result.formatted_address, result.geometry.location.lat,
      result.geometry.location.lng);
  }
  return result

}

function unixTime(date) {
  var nonce = Math.floor((date.getTime()/1000)).toString();
  return nonce;
}

function weatherUnderground(key, lat, lng, time) {

  var url = 'https://api.darksky.net/forecast/'
            + key
            + '/'
            + lat+ ','
            + lng
            + ','
            + time
            + '?exclude=currently,minutely,hourly,alerts,flags'
            + '&lang=en'
            + '&units=si';

  Logger.log(url);
  var response = UrlFetchApp.fetch(url,{muteHttpExceptions:false});
  Logger.log(response);

}

function run() {
  var key = SpreadsheetApp.getActive().getRangeByName('pApikey').getValue();
  var address = SpreadsheetApp.getActive().getRangeByName('pAddress').getValue();
  var geoAddress = geocode(address);
  var lat = geoAddress.geometry.location.lat;
  var lng = geoAddress.geometry.location.lng;
  var time = unixTime(new Date());

  var weatherRes = weatherUnderground(key, lat, lng, time);



}
