function test() {
  var date = new Date()
  var test = unixTime(date);
  Logger.log(test);
}

function testJSON() {

  var testJSON = {
    "latitude": 51.1329,
    "longitude": 5.4536,
    "timezone": "Europe\/Brussels",
    "offset": 2,
    "daily": {
      "data": [
        {
          "time": 1497477600,
          "summary": "Light rain starting in the afternoon, continuing until evening.",
          "icon": "rain",
          "sunriseTime": 1497497028,
          "sunsetTime": 1497556575,
          "moonPhase": 0.68,
          "precipIntensity": 0.2108,
          "precipIntensityMax": 1.209,
          "precipIntensityMaxTime": 1497528000,
          "precipProbability": 0.2,
          "precipType": "rain",
          "temperatureMin": 15.28,
          "temperatureMinTime": 1497492000,
          "temperatureMax": 27.47,
          "temperatureMaxTime": 1497524400,
          "apparentTemperatureMin": 14.51,
          "apparentTemperatureMinTime": 1497492000,
          "apparentTemperatureMax": 26.77,
          "apparentTemperatureMaxTime": 1497524400,
          "dewPoint": 14.66,
          "humidity": 0.66,
          "windSpeed": 1.36,
          "windBearing": 224,
          "cloudCover": 0.45,
          "pressure": 1014.19,
          "ozone": 309.65,
          "uvIndex": 5,
          "uvIndexTime": 1497528000
        }
      ]
    }
  }

  return testJSON;

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

function jsonKeysToArray(jsonFile, fields) {
  var array = [];
  for (var key in jsonFile) {
    if (jsonFile.hasOwnProperty(key) && fields.includes(key)) {
      array.push(key);

    }
  }
  return array;
}

function jsonToArray(jsonFile, fields) {
  var array = [];
  for (var key in jsonFile) {
    if (jsonFile.hasOwnProperty(key) && fields.includes(key)) {
      array.push(jsonFile[key]);

    }
  }
  return array;
}

function darksky(key, lat, lng, time) {

  var url = 'https://api.darksky.net/forecast/'
    + key
    + '/'
    + lat+ ','
    + lng
    + ','
    + time
    + '?exclude=currently,minutely,hourly,flags'
    + '&lang=en'
    + '&units=si';

  Logger.log(url);
  var response = JSON.parse(UrlFetchApp.fetch(url,{muteHttpExceptions:false}));

  return response;

}

function getSheetValues(){
  var spreadsheet = SpreadsheetApp.getActive();
  var sheet = spreadsheet.getSheetByName('data');
  var rows = sheet.getDataRange();
  var values = rows.getValues();
  return values;
}

Array.prototype.includes = function(obj) {
  var i = this.length;
  while (i--) {
    if (this[i] === obj) {
      return true;
    }
  }
  return false;
}

function setSheetValues(array, row){
  var spreadsheet = SpreadsheetApp.getActive();
  var sheet = spreadsheet.getSheetByName('data');
  var rows = sheet.getDataRange();
  var values = rows.getValues();

  var row = row;
  var column = 2;
  var numRows = array.length;
  var numColumns = array[0].length;

  sheet.getRange(row, column, numRows, numColumns).setValues(array);
}

function prompt() {
  var startRow = SpreadsheetApp.getActive().getRangeByName('pStartRow').getValue();
  run(startRow);
}


function run(startRow) {

  // get params
  var key = SpreadsheetApp.getActive().getRangeByName('pApikey').getValue();
  var address = SpreadsheetApp.getActive().getRangeByName('pAddress').getValue();
  var geoAddress = geocode(address);
  var lat = geoAddress.geometry.location.lat;
  var lng = geoAddress.geometry.location.lng;
  //var time = unixTime(new Date());
  var getDates = getSheetValues()
  var fields = "summary,icon,temperatureMin,temperatureMax,humidity,windSpeed".split(",");

  var startRowSheet = startRow || 1;
  var startRowArray = startRow-1 || 1;



  // fetch data and put in array (table) grouped by rows
  var table = [];

  for (i = startRowArray; i < getDates.length; i++) {
    var humanTime = getDates[i][0];
    var time = unixTime(humanTime)
    Logger.log(humanTime);
    try {
      var weatherRes = darksky(key, lat, lng, time);
      //var weatherRes = testJSON();
      //Logger.log(weatherRes.daily);
      if (i == 1) {
        var header = jsonKeysToArray(weatherRes.daily.data[0], fields);
        table.push(header);
      }
      var data = jsonToArray(weatherRes.daily.data[0], fields);
      table.push(data);
    } catch (err) {
      Logger.log(err);
      Logger.log('For index: ' + i);
    }
  }

  // push table to range
  setSheetValues(table, startRowSheet);
  SpreadsheetApp.getActiveSpreadsheet().toast('Weather task finished', 'Status');


}
