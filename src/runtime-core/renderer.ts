import { isObject } from "../shared/index"
import { createComponentInstance, setupComponent } from "./component"

export function render(vnode, container) {
    patch(vnode, container)
}

function patch(vnode, container) {

    if (typeof vnode.type === 'string') {
        // 处理element
        processElement(vnode, container)
    } else if (isObject(vnode.type)) {
        // 去处理组件
        processComponent(vnode, container)
    }
}

function processElement(vnode, container) {
    mountElement(vnode, container)
}

function mountElement(vnode, container) {
    const { type } = vnode;
    const el = (vnode.el = document.createElement(type));

    const { props } = vnode;
    for (const key in props) {
        const value = props[key]
        el.setAttribute(key, value);
    }

    const { children } = vnode;

    if (typeof children === 'string') {
        el.textContent = children
    } else if (Array.isArray(children)) {
        mountChildren(children, el)
    }

    container.append(el);
}

function mountChildren(vnode, container) {
    vnode.forEach(v => {
        patch(v, container);
    });
}

function processComponent(vnode, container) {
    mountComponent(vnode, container)
}

function mountComponent(vnode, container) {
    const instance: any = createComponentInstance(vnode)

    setupComponent(instance)

    setupRenderEffect(instance, vnode, container)
}

function setupRenderEffect(instance, vnode, container) {
    const { proxy } = instance
    const subTree = instance.render.call(proxy)

    // vnode => patch
    patch(subTree, container)

    // 所有element 都已经 mount => 赋值vnode.el
    vnode.el = subTree.el;
}


