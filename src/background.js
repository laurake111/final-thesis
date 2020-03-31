global.browser = require('webextension-polyfill');

function mycallback(info, tab) {
    console.log("item " + info.menuItemId + " was clicked");
    console.log("info: " + JSON.stringify(info));
    console.log("tab: " + JSON.stringify(tab));

    chrome.tabs.sendMessage(tab.id, "getClickedEl", function(clickedEl) {
        console.log("textfield value from inject.js: ", clickedEl);

        chrome.windows.create({
            url: chrome.runtime.getURL("popup/popup.html"),
            type: "popup",
            width: 500,
            height: 450,
            left: 20,
            top: 550
        }, function(win) {
            console.log("window opened: ", win);
            chrome.tabs.sendMessage(win.tabs[0].id, "getVueElement", function(getVueElement) {
                console.log("windows id: ", win.tabs[0].id);
                console.log("vue value: ", getVueElement);
            });
        });
    });
}

chrome.runtime.onMessageExternal.addListener(
    function(request, sender, sendResponse) {
        console.log("request: ", request);
        console.log("sender: ", sender);
        console.log("sendRespinse: ", sendResponse);

        sendResponse("background.js ")
    });

let context = "editable";
let title = "Dikteeri tekst antud tekstivälja";
let id = chrome.contextMenus.create({"title": title, "contexts":[context],
    "onclick": mycallback});
console.log("'" + context + "' item:" + id);

