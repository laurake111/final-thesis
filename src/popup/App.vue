<template>
    <div class="container">
        <div class="row">
            <div class="col">
                <div class="card" style="width: 18rem;">
                    <div class="card-body">
                        <h5 class="card-title">Speech recogniser for Gmail</h5>
                        <p class="card-text">Google extension that supports writing emails on Gmail with speech recognition</p>
                        <a type="button" class="btn btn-outline-danger btn-sm" v-on:click="buttonSearch">Write email now</a>
                    </div>
                </div>
            </div>
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
                window.open("https://mail.google.com");
            }
        }
    };
</script>

<style lang="scss" scoped>
    .container {
        width: 300px;
        text-align: center;
        padding: 10px;
    }

    .card {
        border: none;
        p {
            font-size: 14px;
        }
    }

    .button{
        transition-duration: 0.4s;
        :hover {
            color: white;
        }
    }

</style>