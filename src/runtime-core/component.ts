import { proxyRefs } from "../reactivity/ref";
import { shallowReadonly } from "../reactivity/reactive";
import { emit } from "./componentEmit";
import { initProps } from "./componentProps";
import { PublicInstanceProxyHandlers } from "./componentPublicInstanceHandlers";
import { initSlots } from "./componentSlots";

export function createComponentInstance(vnode, parent) {
    const component = {
        vnode,
        type: vnode.type,
        setupState: {},
        props: {},
        slots: {},
        provides: parent ? parent.provides : {},
        parent,
        isMounted: false,
        subTree: {},
        emit: () => {}
    }

    component.emit = emit.bind(null, component) as any; 

    return component;
}

export function setupComponent(instance) {
    initProps(instance, instance.vnode.props)

    initSlots(instance, instance.vnode.children)

    setupStatefulComponent(instance);
}

function setupStatefulComponent(instance) {

    instance.proxy = new Proxy({ _: instance }, PublicInstanceProxyHandlers)

    const Component = instance.type;

    const { setup } = Component;

    if (setup) {
        setCurrentInstance(instance)
        const setupResult = setup(shallowReadonly(instance.props), { emit: instance.emit });
        handleSetupResult(instance, setupResult);
        setCurrentInstance(null)
    }

}

function handleSetupResult(instance, setupResult) {

    // TODO
    // function 


    // object
    if (typeof setupResult === 'object') {
        instance.setupState = proxyRefs(setupResult);
    }

    finishComponentSetup(instance);
}

function finishComponentSetup(instance) {
    const Component = instance.type

    if (Component.render) {
        instance.render = Component.render
    }
}

let currentInstance = null;

export function getCurrentInstance() {
    return currentInstance;
}

function setCurrentInstance(instance) {
    currentInstance = instance;
}