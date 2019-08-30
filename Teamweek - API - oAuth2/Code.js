// https://developers.teamweek.com/index.html
// https://github.com/gsuitedevs/apps-script-oauth2
//
var CLIENT_ID = SpreadsheetApp.getActiveSpreadsheet().getRangeByName('client_id');
var CLIENT_SECRET = SpreadsheetApp.getActiveSpreadsheet().getRangeByName('client_secret');

function getService() {
  // Create a new service with the given name. The name will be used when
  // persisting the authorized token, so ensure it is unique within the
  // scope of the property store.
    return OAuth2.createService('teamweek')

    // Set the endpoint URLs, which are the same for all Google services.
    .setAuthorizationBaseUrl('https://teamweek.com/oauth/login')
    .setTokenUrl('https://teamweek.com/api/v4/authenticate/token')
  
  
    // Set the client ID and secret, from the Google Developers Console.
    .setClientId(CLIENT_ID)
    .setClientSecret(CLIENT_SECRET)

    // Set the name of the callback function in the script referenced
    // above that should be invoked to complete the OAuth flow.
    .setCallbackFunction('authCallback')

    // Set the property store where authorized tokens should be persisted.
    .setPropertyStore(PropertiesService.getUserProperties())
    
    // Teamweek specific stuff
    .setGrantType('authorization_code')
  
    .setTokenHeaders({
      'Authorization': 'Basic ' + Utilities.base64Encode(CLIENT_ID + ':' + CLIENT_SECRET)
    });
  
  
}

function showSidebar() {
  var service = getService();
  if (!service.hasAccess()) {
    var authorizationUrl = service.getAuthorizationUrl();
    var template = HtmlService.createTemplate(
      '<a href="<?= authorizationUrl ?>" target="_blank">Authorize</a>. ' +
      'Reopen the sidebar when the authorization is complete.');
    template.authorizationUrl = authorizationUrl;
    var page = template.evaluate();
    SpreadsheetApp.getUi().showSidebar(page);
  } else {
    // ...
  }
}

function authCallback(request) {
  var service = getService();
  var isAuthorized = service.handleCallback(request);
  if (isAuthorized) {
    return HtmlService.createHtmlOutput('Success! You can close this tab.');
  } else {
    return HtmlService.createHtmlOutput('Denied. You can close this tab');
  }
}

function convertTimestamp(string) {
  try{
    var d = string.match(/\d+\-\d+\-\d+/);
    return new Date(d);
  } catch(e){
    return;
  }
}


function getTasks() {
  var service = getService();
  if (service.hasAccess()) {
  
    var api = 'https://teamweek.com/api/v4/448904/tasks/timeline';
    
    var headers = {
      "Authorization": "Bearer " + getService().getAccessToken()
    };
    
    var options = {
      "headers": headers,
      "method" : "GET",
      "muteHttpExceptions": true
    };
    
    var response = UrlFetchApp.fetch(api, options);
    
    var json = JSON.parse(response.getContentText());
    
    var array = [];
    

    // Create menu
    array.push(['start_date',
                'end_date',
                'name',
                'notes',
                'color_id',
                'created_at',
                'updated_at'
               ]); 


    for (var i in json) {
      
      array.push([new Date(json[i].start_date),
                  new Date(json[i].end_date),
                  json[i].name,
                  json[i].notes,
                  json[i].color_id,
                  convertTimestamp(json[i].created_at),
                  convertTimestamp(json[i].updated_at)
                 ]); 
    }
    Logger.log(array);
    toSheet(array);
    
  } 
}

function toSheet(data) {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("data"); //replace with source ID
  var width = data[1].length;
  var height = data.length;
  
  spreadsheet.clear();
  spreadsheet.getRange(1, 1, height, width).setValues(data); //you will need to define the size of the copied data see getRange()
}



// for selecting a different account
function logout() {
  var service = getService()
  service.reset();
}



