// Add a custom menu to the active spreadsheet, including a separator and a sub-menu.
function onOpen(e) {
  SpreadsheetApp.getUi()
      .createMenu('Teamweek')
      .addItem('Connect to service', 'showSidebar')
      .addItem('Get tasks', 'getTasks')
      .addItem('Log out', 'logout')
      .addToUi();
}