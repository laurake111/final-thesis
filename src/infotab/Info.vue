<template>
    <div class="container">
        <div class="row row-header">
            <div class="col-8">
                <h5>Kuidas kasutada Laiendust?</h5>

            </div>
            <div class="col-3">
                <img class="icon-img"
                     src="icon.png" type="button">
                </img>
            </div>

        </div>
        <div class="row">
            <div class="col step ">
                <h7>Samm 1</h7>
                <p>Paremkliki mingil tekstiväljal vabalt valitud veebilehel</p>
            </div>
            <div class="col step">
                <h7>Samm 2</h7>
                <p>Vali menüüst 'Dikteeri tekst antud tekstivälja'</p>
            </div>
            <div class="col step">
                <h7>Samm 3</h7>
                <p>Sulle avaneb hüpikaken, kui vajutad aknas sinist nuppu hakkab laiendus Sinu kõne kuulama</p>
            </div>
        </div>
        <div class="row">
            <img class="how-img shadow p-3 mb-2 mt-2 bg-white rounded"
                 src="how.png" type="button">
            </img>
        </div>
        <div class="row">
                <button type="button" class="btn btn-info btn-sm btn-block buttonredirect" v-on:click="buttonSearch">
                    Laienduse koduleht
                </button>
        </div>

    </div>
</template>

<script>
    const browser = require("webextension-polyfill");

    export default {
        data() {
            return {
                keyword: "",
            };
        },
        methods: {
            buttonSearch() {
                window.open("https://chrome.google.com/webstore/detail/k%C3%B5netuvastus/flknjambpipjohjmnghlgilngpcenaii?hl=et&itemlang=ml");
            }
        }
    };
</script>
<style lang="scss" scoped>
    .container {
        font-family: 'Open Sans', sans-serif;
        background-color: white;
        width: 500px;
        text-align: center;
        padding: 10px;
        margin: 15px;
    }

    .row-header {
        margin-bottom: 10px;
    }

    .icon-img {
        width: 40px;
        height: 40px;
        margin: 5px;
        margin-top: -9px;
    }

    .how-img {
        width: 400px;
        margin: auto;

    }

    .buttonredirect {
        margin-top: 10px;
        background-color: #50CDDD;

        :hover {
            background-color: #40ebed;
            color: white;
        }
    }

    .step {
        /*border: #0f6674 groove 1px;*/
        margin: 1px;
        margin-top: 1em;
    }

    p {
        text-align: center;
        font-size: 13px;
    }

    h5 {
        font-weight: bold;
        left:10px;
    }

    h7 {
        font-weight: bold;
    }
</style>