'use strict';

const extend = Object.assign;
const isObject = (val) => {
    return val !== null && typeof val === 'object';
};
const hasOwn = (target, key) => {
    return Object.prototype.hasOwnProperty.call(target, key);
};
const camelize = (str) => {
    return str.replace(/-(\w)/g, (_, c) => {
        return c ? c.toLocaleUpperCase() : '';
    });
};
const capitalize = (str) => {
    return str.charAt(0).toLocaleUpperCase() + str.slice(1);
};
const toHandleKey = (str) => {
    return str ? 'on' + capitalize(str) : '';
};

let targetMap = new Map();
function trigger(target, key) {
    const depsMap = targetMap.get(target);
    const dep = depsMap.get(key);
    triggerEffects(dep);
}
function triggerEffects(dep) {
    dep.forEach((effect) => {
        if (effect.scheduler) {
            effect.scheduler();
        }
        else {
            effect.run();
        }
    });
}

const get = createGetter();
const set = createSetter();
const readonlyGet = createGetter(true);
const createShallowReadonlyGet = createGetter(true, true);
function createGetter(isReadonly = false, shallow = false) {
    return function get(target, key) {
        if (key === "__v_is_reactive" /* ReactiveFlags.IS_REACTIVE */) {
            return !isReadonly;
        }
        else if (key === "__v_is_readonly" /* ReactiveFlags.IS_READONLY */) {
            return isReadonly;
        }
        const res = Reflect.get(target, key);
        if (shallow) {
            return res;
        }
        if (isObject(res)) {
            return isReadonly ? readonly(res) : reactive(res);
        }
        return res;
    };
}
function createSetter() {
    return function set(target, key, value) {
        const result = Reflect.set(target, key, value);
        // 触发依赖
        trigger(target, key);
        return result;
    };
}
const mutableHandlers = {
    get,
    set
};
const readonlyHandlers = {
    get: readonlyGet,
    set(target, key, value) {
        console.warn(`key: ${key} is readonly`);
        return true;
    }
};
const shallowReadonlyHandles = extend({}, readonlyHandlers, {
    get: createShallowReadonlyGet
});

function reactive(raw) {
    return createActiveObject(raw, mutableHandlers);
}
function readonly(raw) {
    return createActiveObject(raw, readonlyHandlers);
}
function shallowReadonly(raw) {
    return createActiveObject(raw, shallowReadonlyHandles);
}
function createActiveObject(target, baseHandlers) {
    if (!isObject(target)) {
        console.warn(`target 【${target}】必须是object类型`);
        return target;
    }
    return new Proxy(target, baseHandlers);
}

function emit(instance, event, ...args) {
    const { props } = instance;
    const handleName = toHandleKey(camelize(event));
    const handler = props[handleName];
    handler && handler(...args);
}

function initProps(instance, rawProps) {
    instance.props = rawProps || {};
    // attrs
}

const publicPropertiesMap = {
    $el: (i) => i.vnode.el
};
const PublicInstanceProxyHandlers = {
    get({ _: instance }, key) {
        const { setupState, props } = instance;
        if (hasOwn(setupState, key)) {
            return setupState[key];
        }
        else if (hasOwn(props, key)) {
            return props[key];
        }
        const publicGetter = publicPropertiesMap[key];
        if (publicGetter) {
            publicGetter(instance);
        }
    }
};

function createComponentInstance(vnode) {
    const component = {
        vnode,
        type: vnode.type,
        setupState: {},
        props: {},
        emit: () => { }
    };
    component.emit = emit.bind(null, component);
    return component;
}
function setupComponent(instance) {
    // TODO
    initProps(instance, instance.vnode.props);
    // initSlots
    setupStatefulComponent(instance);
}
function setupStatefulComponent(instance) {
    instance.proxy = new Proxy({ _: instance }, PublicInstanceProxyHandlers);
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
    const Component = instance.type;
    if (Component.render) {
        instance.render = Component.render;
    }
}

function render(vnode, container) {
    patch(vnode, container);
}
function patch(vnode, container) {
    const { shapeFlag } = vnode;
    if (shapeFlag & 1 /* ShapeFlags.ELEMENT */) {
        // 处理element
        processElement(vnode, container);
    }
    else if (shapeFlag & 2 /* ShapeFlags.STATEFUL_COMPONENT */) {
        // 去处理组件
        processComponent(vnode, container);
    }
}
function processElement(vnode, container) {
    mountElement(vnode, container);
}
function mountElement(vnode, container) {
    const { type } = vnode;
    const el = (vnode.el = document.createElement(type));
    const { props } = vnode;
    for (const key in props) {
        const isOn = (key) => /^on[A-Z]/.test(key);
        const value = props[key];
        // 处理 event
        if (isOn(key)) {
            const event = key.slice(2).toLocaleLowerCase();
            el.addEventListener(event, value);
        }
        else {
            el.setAttribute(key, value);
        }
    }
    const { children, shapeFlag } = vnode;
    if (shapeFlag & 4 /* ShapeFlags.TEXT_CHILDREN */) {
        el.textContent = children;
    }
    else if (shapeFlag & 8 /* ShapeFlags.ARRAY_CHILDREN */) {
        mountChildren(children, el);
    }
    container.append(el);
}
function mountChildren(vnode, container) {
    vnode.forEach(v => {
        patch(v, container);
    });
}
function processComponent(vnode, container) {
    mountComponent(vnode, container);
}
function mountComponent(vnode, container) {
    const instance = createComponentInstance(vnode);
    setupComponent(instance);
    setupRenderEffect(instance, vnode, container);
}
function setupRenderEffect(instance, vnode, container) {
    const { proxy } = instance;
    const subTree = instance.render.call(proxy);
    // vnode => patch
    patch(subTree, container);
    // 所有element 都已经 mount => 赋值vnode.el
    vnode.el = subTree.el;
}

function createVNode(type, props, children) {
    const vnode = {
        type,
        props,
        children,
        shapeFlag: getShapeFlag(type),
        el: null
    };
    if (typeof children === 'string') {
        vnode.shapeFlag |= 4 /* ShapeFlags.TEXT_CHILDREN */;
    }
    else if (Array.isArray(children)) {
        vnode.shapeFlag |= 8 /* ShapeFlags.ARRAY_CHILDREN */;
    }
    return vnode;
}
function getShapeFlag(type) {
    return typeof type === 'string' ? 1 /* ShapeFlags.ELEMENT */ : 2 /* ShapeFlags.STATEFUL_COMPONENT */;
}

function createApp(rootComponent) {
    return {
        mount(rootContainer) {
            // 先转换成vnode
            // 后续操作都基于vnode
            const vnode = createVNode(rootComponent);
            render(vnode, rootContainer);
        }
    };
}

function h(type, props, children) {
    return createVNode(type, props, children);
}

exports.createApp = createApp;
exports.h = h;
