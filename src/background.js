global.browser = require('webextension-polyfill');

let context = "editable";
let title = "Dikteeri tekst antud tekstivälja";
let id = chrome.contextMenus.create({"title": title, "contexts":[context],
    "onclick": mycallback});
console.log("'" + context + "' item:" + id);
let tab_id = null;


function mycallback(info, tab) {
    console.log("item " + info.menuItemId + " was clicked");
    console.log("info: " + JSON.stringify(info));
    console.log("tab: " + JSON.stringify(tab));
    tab_id = tab.id;

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
        });
    });
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log("request: ", request);
        console.log("sender: ", sender);
        console.log("sendRespinse: ", sendResponse);

        if (request.type === "FROM_VUE") {
            sendResponse("background.js ");

            chrome.tabs.sendMessage(tab_id,
                {type:"FROM_BACKGROUND",value:"konetuvastus"},
                function(clickedEl) {
                console.log("vkonetuvastus: ", clickedEl);
            });
        } else {
            console.log("unknown request type:", request)
        }
    });

