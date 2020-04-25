<template>
    <div class="container">
        <div class="row">
            <div class="col">
                <div class="info tooltip">
                    <img class="info-img"
                         src="info-circle-solid.svg" type="button">
                    </img>
                    <p class="tooltiptext">
                        Dikteerida selge häälega ja mõõdukas tempos.
                        Sõnade vahel pause ei pea tegema.
                        Dikteerida saab ka kirjavahemärke (",.!?:;") ja reavahetusi (ütle "uus rida").
                    </p>
                </div><br/>


                <div contenteditable="true" class="txtBox" v-html="popupTranscript">
                    {{ popupTranscript }}
                </div>

                <div id="siri-container">
                </div>

                <div class="button">
                    <img class="mic-img"
                         src="mic.svg" id="image-svg" type="button"
                         v-on:click="dictateButtonAction">
                    </img>
                </div>
                <br>
            </div>
        </div>
    </div>
</template>

<script>
    import SiriWave from '../siriwave.js';

    // The ID of the extension we want to talk to.
    let editorExtensionId = "flknjambpipjohjmnghlgilngpcenaii";
    const browser = require("webextension-polyfill");


    export default {
        data() {
            return {
                transcriptTextBox: '',
                popupTranscript: '',
                recording: false,
                microfoneWorks: false,
                siriWave: null
            };
        },
        created: function () {
            var dictate = new Dictate({
                recorderWorkerPath: '../recorderWorker.js',
                onReadyForSpeech: function () {
                    console.log("READY FOR SPEECH");
                },
                onEndOfSpeech: function () {
                    console.log("END OF SPEECH");
                },
                onEndOfSession: function () {
                    console.log("END OF SESSION");
                },
                onPartialResults: function (hypos) {
                    let spokenText = spokenTextFormat(hypos[0].transcript, this.doUpper, this.doPrependSpace);

                    let oldtext = this.transcriptTextBox.slice(0, this.startPosition);
                    let oldtextEnd = this.transcriptTextBox.slice(this.endPosition);

                    this.transcriptTextBox = oldtext + spokenText + oldtextEnd;
                    this.popupTranscript = this.transcriptTextBox.replace(/\n/g, "<br>");

                    this.endPosition = this.startPosition + spokenText.length;
                }.bind(this),
                onResults: function (hypos) {
                    let spokenText = spokenTextFormat(hypos[0].transcript, this.doUpper, this.doPrependSpace);

                    let oldtext = this.transcriptTextBox.slice(0, this.startPosition);
                    let oldtextEnd = this.transcriptTextBox.slice(this.endPosition);

                    this.transcriptTextBox = oldtext + spokenText + oldtextEnd;
                    this.popupTranscript = this.transcriptTextBox.replace(/\n/g, "<br>");

                    this.startPosition = this.startPosition + spokenText.length;
                    this.endPosition = this.startPosition;

                    this.doUpper = /\. *$/.test(this.transcriptTextBox) || /\n *$/.test(this.transcriptTextBox);
                    this.doPrependSpace = (this.transcriptTextBox.length > 0) && !(/\n *$/.test(this.transcriptTextBox));
                }.bind(this),
                onError: function (code, data) {
                    console.log("code er:", code, data);
                    dictate.cancel();
                },
                onEvent: function (code, data) {
                    console.log(code, data);
                }
            });

            function spokenTextFormat(text, doCapFirst, doPrependSpace) {
                if (doCapFirst) {
                    text = text.charAt(0).toUpperCase() + text.slice(1);
                }
                let tokens = text.split(" ");
                text = "";
                if (doPrependSpace) {
                    text = " ";
                }
                let doCapitalizeNext = false;
                tokens.map(function (token) {
                    if (text.trim().length > 0) {
                        text = text + " ";
                    }
                    if (doCapitalizeNext) {
                        text = text + token.charAt(0).toUpperCase() + token.slice(1);
                    } else {
                        text = text + token;
                    }
                    if (token === "." || /\n$/.test(token)) {
                        doCapitalizeNext = true;
                    } else {
                        doCapitalizeNext = false;
                    }
                });

                text = text.replace(/ ([,.!?:;])/g, "\$1");
                text = text.replace(/ ?\n ?/g, "\n");
                return text;
            }

            this.dictate = dictate;
            this.dictate.init();
            this.recording = false;
            this.doUpper = true;
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
                    this.startDictation();
                } else {
                    this.stopDictation();
                }
            },
            startDictation() {
                this.dictate.startListening();
                this.recording = true;
                document.getElementById('image-svg').src = "pause.svg";
                this.animateSiriwave();
            },
            stopDictation() {
                this.dictate.stopListening();
                document.getElementById('image-svg').src = "mic.svg";
                chrome.runtime.sendMessage(editorExtensionId,
                    {type: "FROM_VUE", value: this.transcriptTextBox},
                    function (response) {
                        console.log("i WORK: ", response)
                    });
                this.recording = false;
            },
            getAverage(array) {
                var values = 0;
                var average;
                var length = array.length;

                for (var i = 0; i < length; i++) {
                    values += array[i];
                }
                average = values / length;
                return average;
            },
            remapValues(x, in_min, in_max, out_min, out_max) {
                return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
            },
            animateSiriwave() {
                var freqByteData = new Uint8Array(userSpeechAnalyser.frequencyBinCount);
                userSpeechAnalyser.getByteFrequencyData(freqByteData);
                var average = this.getAverage(freqByteData);
                var result = this.remapValues(average, 0, 256, 0, 10);

                this.siriWave.setAmplitude(result);
                if (this.recording) {
                    window.requestAnimationFrame(this.animateSiriwave);
                } else {
                    this.siriWave.setAmplitude(0);
                }

                if (!document.hasFocus()) {
                    this.stopDictation();
                    window.close();
                }
            },
            initialized() {
                this.siriWave = new SiriWave({
                    container: document.getElementById('siri-container'),
                    width: 600,
                    height:200,
                    color: '#50CDDD',
                    style: "ios",
                    autostart: true,
                    amplitude:0
                });


            }
        },
        mounted() {
            this.initialized();
        }
    }
</script>

<style lang="scss" scoped>
    .container {
        background-color: black;
        width: 300px;
        text-align: center;
        padding: 10px;
        color: white;
    }

    .button {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 80px;
        height: 80px;
        border-radius: 50%;
        background: #50CDDD;
        box-shadow: 0px 0px 80px #0084F9;
        position: absolute;
        top: 400px;
        left: 110px;
    }

    #siri-container {
        width: 498px;
        position: absolute;
        top: 225px;
        left: -115px;
        height: 189px;
    }

    .mic-img {
        height: 40px;
        margin: 20px;
    }

    .info-img {
        height: 18px;
    }

    .txtBox {
        /*border: solid 0.5px hotpink;*/
        overflow: auto;
        color: white;
        margin-top: 50px;
    }

    .tooltip {
        position: relative;
        display: inline-block;
        border-bottom: 1px dotted black;
        opacity: 100;
    }

    .tooltip .tooltiptext {
        visibility: hidden;
        width: 250px;
        background-color: black;
        color: #fff;
        text-align: center;
        border-radius: 6px;
        padding: 5px 0;
        position: absolute;
        z-index: 1;
        top: 100%;
        left: 50%;
        margin-left: -120px;
    }

    .tooltip:hover .tooltiptext {
        visibility: visible;
    }
</style>
