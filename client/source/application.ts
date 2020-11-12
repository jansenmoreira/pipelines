import Vue from "vue";
import App from "./App.vue";

const style = require("./style.css");

class Teste {
    public static readonly ROOT: string = "#app";
}

new Vue({
    el: `${Teste.ROOT}`,
    render: (h) => h(App),
});
