import { h } from "../../lib/guide-mini-vue.esm.js"
import { Foo } from "./Foo.js"

export const App = {
    name: 'App',
    render() {
        // emit
        return h('div', {}, [h('div', {}, 'App'), h(Foo, { onAdd: this.onAdd, onAddFoo: this.onAddFoo })])
    },

    setup() {
        const onAdd = (a, b) => {
            console.log('onAdd', a, b)
        }

        const onAddFoo = (a, b) => {
            console.log('onAddFoo', a, b)
        }
        return {
            onAdd,
            onAddFoo
        }
    }
}