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
                        <textarea rows="8" cols="20" id="trans"></textarea>
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

    const browser = require("webextension-polyfill");


    // The ID of the extension we want to talk to.
    let editorExtensionId = "lmaehgbgmcanenelmfkhidbljcgabpli";

    export default {

        data() {
            return {
                keyword: "",
            };
        },
        components: {
            SiriWave
        },
        methods: {
            startDictate() {
                dictate.startListening();
            },
            stopDictate() {
                dictate.stopListening();
                chrome.runtime.sendMessage(editorExtensionId,
                    {type:"FROM_VUE",value:tt.toString()},
                    function(response) {
                        console.log(tt.toString());
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