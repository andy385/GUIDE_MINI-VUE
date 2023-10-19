import { h, ref } from "../../lib/guide-mini-vue.esm.js";

export const App = {
    name: 'APP',
    render() {
        window.self = this;
        return h(
            'div',
            {
                id: 'root',
                ...this.props
            },
            [
                // h('p', {}, 'count: ' + this.count),
                // h('button', { onClick: this.clickAdd }, 'click-add'),
                h('button', { onClick: this.onChangePropsDemo1 }, '修改值'),
                h('button', { onClick: this.onChangePropsDemo2 }, '值undefined'),
                h('button', { onClick: this.onChangePropsDemo3 }, '删除值')
            ]
        );
    },

    setup() {
        const count = ref(0);
        const clickAdd = () => {
            count.value++;
        }

        const props = ref({
            foo: 'foo',
            bar: 'bar'
        })

        const onChangePropsDemo1 = () => {
            props.value.foo = 'new-foo'
        }

        const onChangePropsDemo2 = () => {
            props.value.foo = undefined
        }

        const onChangePropsDemo3 = () => {
            props.value = {
                foo: 'foo',
                baz: 'baz'
            }
        }
        return {
            count,
            clickAdd,
            props,
            onChangePropsDemo1,
            onChangePropsDemo2,
            onChangePropsDemo3
        };
    },
};
