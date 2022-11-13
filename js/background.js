// chrome.browserAction.onClicked.addListener(function(tab) {
//     // Send a message to the active tab
//     chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//       var activeTab = tabs[0];
//       chrome.tabs.sendMessage(activeTab.id, {"message": "clicked_browser_action"});
//     });

//   });


chrome.runtime.onInstalled.addListener(() => {
  // default state goes here
  // this runs ONE TIME ONLY (unless the user reinstalls your extension)
});