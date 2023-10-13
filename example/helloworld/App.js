import { h } from "../../lib/guide-mini-vue.esm.js"

export const App = {
    render() {
        window.self = this
        return h('div', { id: 'root' }, [
            h('p', { class: 'red' }, 'hi'),
            h('p', { class: "blue" }, this.msg)
        ])
    },

    setup() {
        return {
            msg: 'mini-vue'
        }
    }
}