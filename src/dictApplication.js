var tt = new Transcription();

var dictate = new Dictate({
    recorderWorkerPath : '../recorderWorker.js',
    onReadyForSpeech : function() {
        __message("READY FOR SPEECH");
        __status("Kuulan ja transkribeerin...");
    },
    onEndOfSpeech : function() {
        __message("END OF SPEECH");
        __status("Transkribeerin...");
    },
    onEndOfSession : function() {
        __message("END OF SESSION");
        __status("");
    },
    onPartialResults : function(hypos) {
        tt.add(hypos[0].transcript, false);
        __updateTranscript(tt.toString());
    },
    onResults : function(hypos) {
        tt.add(hypos[0].transcript, true);
        __updateTranscript(tt.toString());
    },
    onError : function(code, data) {
        dictate.cancel();
    },
    onEvent : function(code, data) {
        __message(code, data);
    }

});

function __message(code, data) {
    console.log( "msg: " + code + ": " + (data || ''));
}

function __error(code, data) {
    console.log( "ERR: " + code + ": " + (data || ''));
}

function __status(msg) {
    console.log('status msg: ', msg);
}


var transcript = '';

function __updateTranscript(text) {
    transcript = text;
}

function startListening() {
    dictate.startListening();
}

function stopListening() {
    dictate.stopListening();
}

function cancel() {
    dictate.cancel();
}

function init() {
    dictate.init();
}

window.onload = function() {
    init();
};