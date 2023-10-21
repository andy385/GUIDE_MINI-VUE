import { h } from "../../lib/guide-mini-vue.esm.js"

export default {
    name: 'Child2',
    setup(props, { emit }) {

    },

    render() {
        return h('div', {}, [
            h('p', {}, 'child-props-msg: ' + this.$props.message)
        ])
    }
}