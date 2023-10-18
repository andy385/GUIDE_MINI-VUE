import { h, provide, inject } from "../../lib/guide-mini-vue.esm.js";

const Provider = {
    name: 'Provider',
    setup() {
        provide('foo', 'fooVal');
        provide('bar', 'barVal');
    },

    render() {
        return h('div', {}, [h('p', {}, 'Provider'), h(ProviderTwo)])
    }
}

const ProviderTwo = {
    name: 'ProviderTwo',
    setup() {
        provide('foo', 'fooValTwo');
        provide('bar', 'barValTwo');

        const foo = inject('foo');
        const bar = inject('bar');

        return {
            foo,
            bar
        }
    },

    render() {
        return h('div', {}, [h('p', {}, 'ProviderTwo' + this.foo + ' - ' + this.bar), h(Consumer)])
    }
}

const Consumer = {
    name: 'Consumer',
    setup() {
        const foo = inject('foo');
        const bar = inject('bar');
        const baz = inject('baz', () => 'default-baz')

        return {
            foo,
            bar,
            baz
        }
    },

    render() {
        return h('div', {}, `Consumer: -${this.foo} - ${this.bar} - ${this.baz}`)
    }
}

export default {
    name: 'App',
    setup() {},
    render() {
        return h('div', {}, [h('p', {}, 'apiInject'), h(Provider)])
    }

}