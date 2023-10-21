import { h, ref } from "../../lib/guide-mini-vue.esm.js"
import Child2 from "./Child2.js"

export default {
    name: 'Child',
    setup(props, { emit }) {
        const message = ref('aaaaa')
        const changeMessage = () => {
            message.value = 'bbbbb'
        }

        return {
            message,
            changeMessage
        }
    },

    render() {
        return h('div', {}, [
            h('p', {}, 'child-props-msg: ' + this.$props.msg),
            h('p', {}, '========'),
            h('button', { onClick: this.changeMessage }, 'change-child2-message'),
            h(Child2, { message: this.message }),
        ])
    }
}