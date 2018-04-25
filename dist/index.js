import Vue from "vue";
import HelloDecorator from "./components/HelloDecorator.vue";
import HelloDecorator1 from "./components/HelloDecorator.1.vue";
var v = new Vue({
    el: "#app",
    template: "\n    <div>\n        <div>\n            Name: <input v-model=\"name\" type=\"text\">\n            <hello-decorator :name=\"name\" :initialEnthusiasm=\"5\" />\n        </div>\n        <hello-decorator-1 />\n    </div>\n    ",
    data: { name: "World" },
    components: {
        HelloDecorator: HelloDecorator,
        HelloDecorator1: HelloDecorator1
    }
});
//# sourceMappingURL=index.js.map