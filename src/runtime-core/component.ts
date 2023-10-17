import { shallowReadonly } from "../reactivity/reactive";
import { emit } from "./componentEmit";
import { initProps } from "./componentProps";
import { PublicInstanceProxyHandlers } from "./componentPublicInstanceHandlers";
import { initSlots } from "./componentSlots";

export function createComponentInstance(vnode) {
    const component = {
        vnode,
        type: vnode.type,
        setupState: {},
        props: {},
        slots: {},
        emit: () => {}
    }

    component.emit = emit.bind(null, component) as any; 

    return component;
}

export function setupComponent(instance) {
    // TODO
    initProps(instance, instance.vnode.props)

    initSlots(instance, instance.vnode.children)

    setupStatefulComponent(instance);
}

function setupStatefulComponent(instance) {

    instance.proxy = new Proxy({ _: instance }, PublicInstanceProxyHandlers)

    const Component = instance.type;

    const { setup } = Component;

    if (setup) {
        const setupResult = setup(shallowReadonly(instance.props), { emit: instance.emit });
        handleSetupResult(instance, setupResult);
    }

}

function handleSetupResult(instance, setupResult) {

    // TODO
    // function 


    // object
    if (typeof setupResult === 'object') {
        instance.setupState = setupResult;
    }

    finishComponentSetup(instance);
}

function finishComponentSetup(instance) {
    const Component = instance.type

    if (Component.render) {
        instance.render = Component.render
    }
}