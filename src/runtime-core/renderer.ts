import { ShapeFlags } from "../shared/ShapeFlags"
import { createComponentInstance, setupComponent } from "./component"
import { createAppAPI } from "./createApp";
import { Fragment, Text } from "./vnode";

export function createRenderer(options) {
    const { createElement: hostCreateElement, patchProp: hostPatchProp, insert: hostInsert } = options

    function render(vnode, container) {
        patch(vnode, container, null)
    }

    function patch(vnode, container, parentComponent) {

        const { type, shapeFlag } = vnode;

        switch (type) {
            case Fragment:
                // 只渲染children
                processFragment(vnode, container, parentComponent);
                break;
            case Text:
                processText(vnode, container);
                break;

            default:
                if (shapeFlag & ShapeFlags.ELEMENT) {
                    // 处理element
                    processElement(vnode, container, parentComponent)
                } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
                    // 去处理组件
                    processComponent(vnode, container, parentComponent)
                }
                break;
        }

    }

    function processText(vnode, container) {
        const { children } = vnode;
        const textNode = (vnode.el = document.createTextNode(children));
        container.append(textNode);
    }

    function processFragment(vnode, container, parentComponent) {
        mountChildren(vnode, container, parentComponent)
    }

    function processElement(vnode, container, parentComponent) {
        mountElement(vnode, container, parentComponent)
    }

    function mountElement(vnode, container, parentComponent) {
        const { type } = vnode;
        const el = (vnode.el = hostCreateElement(type));

        const { props } = vnode;
        for (const key in props) {
            const value = props[key]
            hostPatchProp(el, key, value)
        }

        const { children, shapeFlag } = vnode;

        if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
            el.textContent = children
        } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
            mountChildren(vnode, el, parentComponent)
        }

        hostInsert(el, container);
    }

    function mountChildren(vnode, container, parentComponent) {
        vnode.children.forEach(v => {
            patch(v, container, parentComponent);
        });
    }

    function processComponent(vnode, container, parentComponent) {
        mountComponent(vnode, container, parentComponent)
    }

    function mountComponent(initialVNode, container, parentComponent) {
        const instance: any = createComponentInstance(initialVNode, parentComponent)

        setupComponent(instance)

        setupRenderEffect(instance, initialVNode, container)
    }

    function setupRenderEffect(instance, initialVNode, container) {
        const { proxy } = instance
        const subTree = instance.render.call(proxy)

        // vnode => patch
        patch(subTree, container, instance)

        // 所有element 都已经 mount => 赋值vnode.el
        initialVNode.el = subTree.el;
    }

    return {
        createApp: createAppAPI(render)
    }
}