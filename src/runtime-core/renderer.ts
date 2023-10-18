import { ShapeFlags } from "../shared/ShapeFlags"
import { createComponentInstance, setupComponent } from "./component"
import { Fragment, Text } from "./vnode";

export function render(vnode, container) {
    patch(vnode, container)
}

function patch(vnode, container) {

    const { type, shapeFlag } = vnode;

    switch (type) {
        case Fragment:
            // 只渲染children
            processFragment(vnode, container);
            break;
        case Text:
            processText(vnode, container);
            break;
    
        default:
            if (shapeFlag & ShapeFlags.ELEMENT) {
                // 处理element
                processElement(vnode, container)
            } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
                // 去处理组件
                processComponent(vnode, container)
            }
            break;
    }

}

function processText(vnode, container) {
    const { children } = vnode;
    const textNode = (vnode.el = document.createTextNode(children));
    container.append(textNode);
}

function processFragment(vnode, container) {
    mountChildren(vnode, container)
}

function processElement(vnode, container) {
    mountElement(vnode, container)
}

function mountElement(vnode, container) {
    const { type } = vnode;
    const el = (vnode.el = document.createElement(type));

    const { props } = vnode;
    for (const key in props) {
        const isOn = (key) => /^on[A-Z]/.test(key)
        const value = props[key]
        // 处理 event
        if (isOn(key)) {
            const event = key.slice(2).toLocaleLowerCase();
            el.addEventListener(event, value)
        } else {
            el.setAttribute(key, value);
        }
    }

    const { children, shapeFlag } = vnode;

    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
        el.textContent = children
    } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        mountChildren(vnode, el)
    }

    container.append(el);
}

function mountChildren(vnode, container) {
    vnode.children.forEach(v => {
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