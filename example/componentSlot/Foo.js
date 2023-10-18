import { createTextVNode, h, renderSlots } from "../../lib/guide-mini-vue.esm.js"

export const Foo = {
    name: 'Foo',
    render() {
        const foo = h('p', {}, 'Foo')
        console.log('$slots', this.$slots)
        // children => vnode

        // 具名插槽
        // 获取要渲染的元素
        // 要获取渲染的位置
        return h(
            'div',
            {},
            [
                renderSlots(this.$slots, 'header', { age: this.age }),
                foo,
                renderSlots(this.$slots, 'footer'),
                createTextVNode('hello')
            ]
        )
    },

    setup() {
        return {
            age: "10"
        }
    }
}