import { h, ref } from "../../lib/guide-mini-vue.esm.js";

export const App = {
    name: 'APP',
    render() {
        window.self = this;
        return h(
            'div',
            {},
            [
                h('p', {}, 'count: ' + this.count),
                h('button', { onClick: this.clickAdd }, 'click-add')
            ]
        );
    },

    setup() {
        const count = ref(0);
        const clickAdd = () => {
            count.value++;
        }
        return {
            count,
            clickAdd
        };
    },
};
