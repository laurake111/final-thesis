<template>
    <div class="container">
        <div class="row">
            <div class="col">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Dikteeri!</h5>
                        <div class="col-md-12">
                            <div class="info">
                                <img class="info-img" src="info-circle-solid.svg" type="button" v-on:click="toggle_visibility('info')"></img>
                            </div><br/>
                        </div>
                        <div id="info">
                            <p class="text-left font-weight-light mb-0">
                                Dikteerida selge häälega ja mõõdukas tempos.
                                Sõnade vahel pause ei pea tegema.
                            </p>
                            <p class="text-left font-weight-light">
                                Dikteerida saab ka kirjavahemärke (",.!?:;") ja reavahetusi (ütle "uus rida").
                            </p>
                        </div>
                        <div id="siri-container"></div>
                        <a type="button" class="btn btn-outline-danger btn-sm" v-on:click="dictateButtonAction">Alusta</a>
                        <br>
                        <textarea>{{ transcriptTextBox }}</textarea>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import SiriWave from '../siriwave.js';

    let siriWave = new SiriWave({
        container: document.getElementById('siri-container'),
        width: 450,
        height: 200,
        cover: true,
        color: '#e640cf',
        style: "ios"
    });

    siriWave.start();
    siriWave.setAmplitude(0);


    // The ID of the extension we want to talk to.
    let editorExtensionId = "lbngllkoamojlnmcijckkgmgehkgpkma";
    const browser = require("webextension-polyfill");


    export default {

        data() {
            return {
                transcriptTextBox: '',
                recording: false,
            };
        },
        created: function () {
            var dictate = new Dictate({
                recorderWorkerPath : '../recorderWorker.js',
                onReadyForSpeech : function() {
                    console.log("READY FOR SPEECH");
                },
                onEndOfSpeech : function() {
                    console.log("END OF SPEECH");
                },
                onEndOfSession : function() {
                    console.log("END OF SESSION");
                },
                onPartialResults : function(hypos) {
                    let spokenText = spokenTextFormat(hypos[0].transcript, this.doUpper, this.doPrependSpace);

                    let oldtext = this.transcriptTextBox.slice(0, this.startPosition);
                    let oldtextEnd = this.transcriptTextBox.slice(this.endPosition);

                    this.transcriptTextBox =  oldtext + spokenText + oldtextEnd;

                    this.endPosition = this.startPosition + spokenText.length;
                }.bind(this),
                onResults : function(hypos) {
                    let spokenText = spokenTextFormat(hypos[0].transcript, this.doUpper, this.doPrependSpace);

                    let oldtext = this.transcriptTextBox.slice(0, this.startPosition);
                    let oldtextEnd = this.transcriptTextBox.slice(this.endPosition);

                    this.transcriptTextBox =  oldtext + spokenText + oldtextEnd;

                    this.startPosition = this.startPosition + spokenText.length;
                    this.endPosition = this.startPosition;

                    this.doUpper = /\. *$/.test(this.transcriptTextBox) || /\n *$/.test(this.transcriptTextBox);
                    this.doPrependSpace = (this.transcriptTextBox.length > 0) && !(/\n *$/.test(this.transcriptTextBox));
                }.bind(this),
                onError : function(code, data) {
                    console.log("code er:", code, data);
                    dictate.cancel();
                },
                onEvent : function(code, data) {
                    console.log(code, data);
                }
            });

            function capitaliseFirstLetter(string) {
                return string.charAt(0).toUpperCase() + string.slice(1);
            }

            function spokenTextFormat(text, doCapFirst, doPrependSpace) {
                if (doCapFirst) {
                    text = capitaliseFirstLetter(text);
                }
                let tokens = text.split(" ");
                text = "";
                if (doPrependSpace) {
                    text = " ";
                }
                let doCapitalizeNext = false;
                tokens.map(function(token) {
                    if (text.trim().length > 0) {
                        text = text + " ";
                    }
                    if (doCapitalizeNext) {
                        text = text + capitaliseFirstLetter(token);
                    } else {
                        text = text + token;
                    }
                    if (token === "." ||  /\n$/.test(token)) {
                        doCapitalizeNext = true;
                    } else {
                        doCapitalizeNext = false;
                    }
                });

                text = text.replace(/ ([,.!?:;])/g,  "\$1");
                text = text.replace(/ ?\n ?/g,  "\n");
                return text;
            }

            this.dictate = dictate;
            this.dictate.init();
            this.recording = false;
            this.doUpper  = false;
            this.doPrependSpace = true;
            this.startPosition = 0;
            this.endPosition = 0;



        },
        components: {
            SiriWave
        },
        methods: {
            dictateButtonAction() {
                if (this.recording === false) {
                    console.log("started listening");
                    siriWave.setAmplitude(1);
                    this.dictate.startListening();
                    this.recording = true;
                } else {
                    console.log('stopped listeinng')
                    this.dictate.stopListening();
                    siriWave.setAmplitude(0);
                    console.log('this is tt: ', this.transcriptTextBox);
                    chrome.runtime.sendMessage(editorExtensionId,
                        {type:"FROM_VUE",value: this.transcriptTextBox},
                        function(response) {
                            console.log("i WORK: ", response)
                        });
                    this.recording = true;
                }

            },
            toggle_visibility(id) {
                let e = document.getElementById(id);
                if(e.style.display === 'block') {
                    e.style.display = 'none';
                } else {
                    e.style.display = 'block';
                }}
             },
    }
</script>

<style lang="scss" scoped>
    .container {
        background-color:black;
        width: 300px;
        text-align: center;
        padding: 10px;
        color: white;
    }

    #info{
        display: none;
    }

    .card {
        border: none;
        background-color:black;
        p {
            font-size: 13px;
        }
    }

    .button{
        transition-duration: 0.4s;
        :hover {
            color: white;
        }
    }

    .info-img {
        height: 18px;
    }

</style>
