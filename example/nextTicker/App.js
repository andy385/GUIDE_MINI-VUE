import { getCurrentInstance, h, nextTick, ref } from "../../lib/guide-mini-vue.esm.js";

export const App = {
    name: 'APP',
    render() {
        return h('div',{}, [
            h('p', {}, 'count: ' + this.count),
            h('button', { onClick: this.clickAdd }, 'click')
        ]);
    },

    setup() {
        const instance = getCurrentInstance();
        const count = ref(0);
        const clickAdd = () => {
            for (let i = 0; i < 100; i++) {
                count.value = i
            }

            console.log(instance)

            nextTick(() => {
                console.log(instance)
            })
        }
        return {
            count,
            clickAdd
        };
    },
};
