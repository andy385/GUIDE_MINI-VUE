import { h } from "../../lib/guide-mini-vue.esm.js";
import { Foo } from "./Foo.js";

export const App = {
    name: 'App',
    render() {
        const app = h('div', {}, this.name);
        const foo = h(Foo, {}, {
            header: ({ age }) => h('p', {}, age),
            footer: () =>  h('p', {}, 'footer'),
        });
        return h('div', {}, [app, foo])
    },

    setup() {
        return {
            name: 'App'
        }
    }
}