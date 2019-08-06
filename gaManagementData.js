/**
 * Lists Analytics accounts.
 */
var accountId = 3356674;
var webPropertyId = 'UA-3356674-58';
var profileId = 100943030;

function getGaSettings(callType) {
  var spreadsheet = SpreadsheetApp.getActive();
  var sheet = spreadsheet.getActiveSheet();

  var call = {
    customdimensions: Analytics.Management.CustomDimensions.list(accountId, webPropertyId),
    custommetrics: Analytics.Management.CustomMetrics.list(accountId, webPropertyId),
    goals: Analytics.Management.Goals.list(accountId, webPropertyId, profileId),
    segments: Analytics.Management.Segments.list(),
    audiences: Analytics.Management.RemarketingAudience.list(accountId, webPropertyId)
  }

  var request = call[callType];
  
  //clear current sheet
  sheet.clear();
  Logger.log(request);
  
  //add header
  sheet.appendRow(['kind', 'created', 'scope', 'name', 'index', 'active', 'id', 'updated', 'webPropertyId', 'selfLink']);
  
  if (request.items && request.items.length) {
    for (var i = 0; i < request.items.length; i++) {
      var row = [request.items[i].kind,
                request.items[i].created,
                request.items[i].scope,
                request.items[i].name,
                request.items[i].index,
                request.items[i].active,
                request.items[i].id,
                request.items[i].updated,
                request.items[i].webPropertyId,
                request.items[i].selfLink];

      sheet.appendRow(row);
    }
  } else {
    Logger.log('No ' + callType + ' found.');
  }
}


function getCustomDimensions() {
  getGaSettings('customdimensions');
}

function getCustomMetrics() {
  getGaSettings('custommetrics');
}

function getGoals() {
  getGaSettings('goals');
}

function getSegments() {
  getGaSettings('segments');
}

function getAudiences() {
  getGaSettings('audiences');
}


