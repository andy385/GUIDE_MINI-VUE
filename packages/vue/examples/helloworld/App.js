import { h } from "../../dist/guide-mini-vue.esm.js";
import { Foo } from "./Foo.js";

export const App = {
    name: 'APP',
    render() {
        window.self = this;
        return h(
            "div",
            {
                id: "root",
                onClick: () => {
                    console.log("aaa");
                },
            },
            [h("p", { class: "red" }, "hi"), h("p", { class: "blue" }, this.msg), h(Foo, { count: 1 })]
        );
    },

    setup() {
        return {
            msg: "mini-vue",
        };
    },
};
