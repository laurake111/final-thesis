<template>
    <div class="container">
        <div class="row">
            <div class="col">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Dikteeri!</h5>
                        <div class="col-md-12">
                            <div class="info">
                                <i class="icon-info-sign" type="button" v-on:click="toggle_visibility('info')"></i>
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
                        <a type="button" class="btn btn-outline-danger btn-sm" v-on:click="startDictate">Alusta</a>
                        <a type="button" class="btn btn-outline-danger btn-sm" v-on:click="stopDictate">Lõpeta</a>
                        <br>
                        <span> Text: {{ transcriptTextBox }}</span>
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
        style: "ios9"
    });
    siriWave.start();


    // The ID of the extension we want to talk to.
    let editorExtensionId = "lmaehgbgmcanenelmfkhidbljcgabpli";
    const browser = require("webextension-polyfill");


    export default {

        data() {
            return {
                transcriptTextBox: '',
            };
        },
        created: function () {

            var tt = new Transcription();

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
                    tt.add(hypos[0].transcript, false);
                    console.log(tt.toString());
                    this.transcriptTextBox = tt.toString();
                }.bind(this),
                onResults : function(hypos) {
                    tt.add(hypos[0].transcript, true);
                    console.log(tt.toString());
                    this.transcriptTextBox = tt.toString();
                }.bind(this),
                onError : function(code, data) {
                    console.log("code er:", code, data)

                    dictate.cancel();
                },
                onEvent : function(code, data) {
                    console.log(code, data);
                }
            });

            this.dictate = dictate;
            this.tt = tt;
            this.dictate.init();

        },
        components: {
            SiriWave
        },
        methods: {
            startDictate() {
                console.log("started listening");
                this.dictate.startListening();
            },
            stopDictate() {
                this.dictate.stopListening();
                console.log('this is tt: ',this.tt.toString());
                chrome.runtime.sendMessage(editorExtensionId,
                    {type:"FROM_VUE",value:this.tt.toString()},
                    function(response) {
                        console.log("i WORK: ", response)
                    });
            },
            toggle_visibility(id) {
                let e = document.getElementById(id);
                if(e.style.display === 'block')
                    e.style.display = 'none';
                else
                    e.style.display = 'block';
            }
        }
    };
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

</style>
