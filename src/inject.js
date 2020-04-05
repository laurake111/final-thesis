//content script
let clickedEl = null;

document.addEventListener("mousedown", function(event){
    if(event.button === 2) {
        clickedEl = event.target;
    }
}, true);

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log("request: ", request);
    console.log("sender: ", sender);
    console.log("sendResponse: ", sendResponse);


    sendResponse();

    if(request.type === 'FROM_BACKGROUND'){
        let activeElement = document.activeElement;
        let inputs = ['input', 'textarea'];

        if (activeElement && inputs.indexOf(activeElement.tagName.toLowerCase()) !== -1) {
            console.log('im an input or textarea');
            document.activeElement.value = request.value;
        } else {
            console.log('im a div');
            document.activeElement.innerHTML = request.value;
        }
    }


});

