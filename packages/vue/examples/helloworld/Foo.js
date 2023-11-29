import { h } from "../../dist/guide-mini-vue.esm.js";

export const Foo = {
    render() {
        return h('div', {}, 'Foo ' + this.count)
    },

    setup(props) {
        // props
        console.log('props', props);

        // props is shallowReadonly
        // props.count++; 
    }
}