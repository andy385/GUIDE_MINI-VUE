import { effect } from "../reactivity/effect";
import { EMPTY_OBJ } from "../shared";
import { ShapeFlags } from "../shared/ShapeFlags"
import { createComponentInstance, setupComponent } from "./component"
import { createAppAPI } from "./createApp";
import { Fragment, Text } from "./vnode";

export function createRenderer(options) {
    const { 
        createElement: hostCreateElement,
        patchProp: hostPatchProp,
        insert: hostInsert,
        remove: hostRemove,
        setElementText: hostSetElementText
    } = options

    function render(vnode, container) {
        patch(null, vnode, container, null)
    }

    // n1 => 老vnode
    // n2 => 新vnode
    function patch(n1, n2, container, parentComponent) {

        const { type, shapeFlag } = n2;

        switch (type) {
            case Fragment:
                // 只渲染children
                processFragment(n1, n2, container, parentComponent);
                break;
            case Text:
                processText(n1, n2, container);
                break;

            default:
                if (shapeFlag & ShapeFlags.ELEMENT) {
                    // 处理element
                    processElement(n1, n2, container, parentComponent)
                } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
                    // 去处理组件
                    processComponent(n1, n2, container, parentComponent)
                }
                break;
        }

    }

    function processText(n1, n2, container) {
        const { children } = n2;
        const textNode = (n2.el = document.createTextNode(children));
        container.append(textNode);
    }

    function processFragment(n1, n2, container, parentComponent) {
        mountChildren(n2.children, container, parentComponent)
    }

    function processElement(n1, n2, container, parentComponent) {
        if (!n1) {
            mountElement(n1, n2, container, parentComponent)
        } else {
            patchElement(n1, n2, container, parentComponent)
        }
    }

    function patchElement(n1, n2, container, parentComponent) {
        // console.log(n1)
        // console.log(n2)

        const el = (n2.el = n1.el)
        const oldProps = n1.props || EMPTY_OBJ
        const newProps = n2.props || EMPTY_OBJ
        patchProps(el, oldProps, newProps)
        patchChildren(n1, n2, el, parentComponent)
    }

    function patchChildren(n1, n2, container, parentComponent) {
        const c1 = n1.children
        const c2 = n2.children
        const prevShapeFlag = n1.shapeFlag
        const shapeFlag = n2.shapeFlag

        if(shapeFlag & ShapeFlags.TEXT_CHILDREN) {
            if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
                // 清空老的children
                unmountChildren(n1.children)
            }

            if(c1 !== c2) {
                // 设置新的children
                hostSetElementText(container, c2)
            }
        } else {
            if (prevShapeFlag & ShapeFlags.TEXT_CHILDREN) {
                hostSetElementText(container, '');
                mountChildren(c2, container, parentComponent)
            }
        }
        
    }

    function unmountChildren(children) {
        for(let i = 0; i < children.length; i++) {
            const el = children[i].el
            hostRemove(el)
        }
    }

    function patchProps(el, oldProps, newProps) {
        if (oldProps !== newProps) {
            for (const key in newProps) {
                const pervProp = oldProps[key]
                const nextProp = newProps[key]
                if(pervProp !== nextProp) {
                    hostPatchProp(el, key, pervProp, nextProp)
                }
            }
    
            if(oldProps !== EMPTY_OBJ) {
                for (const key in oldProps) {
                    if(!(key in newProps)) {
                        console.log(key)
                        hostPatchProp(el, key, oldProps[key], null)
                    }
                }
            }
        }
    }

    function mountElement(n1, n2, container, parentComponent) {
        const { type } = n2;
        const el = (n2.el = hostCreateElement(type));

        const { props } = n2;
        for (const key in props) {
            const value = props[key]
            hostPatchProp(el, key, null, value)
        }

        const { children, shapeFlag } = n2;

        if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
            el.textContent = children
        } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
            mountChildren(n2.children, el, parentComponent)
        }

        hostInsert(el, container);
    }

    function mountChildren(children, container, parentComponent) {
        children.forEach(v => {
            patch(null, v, container, parentComponent);
        });
    }

    function processComponent(n1, n2, container, parentComponent) {
        mountComponent(n2, container, parentComponent)
    }

    function mountComponent(initialVNode, container, parentComponent) {
        const instance: any = createComponentInstance(initialVNode, parentComponent)

        setupComponent(instance)

        setupRenderEffect(instance, initialVNode, container)
    }

    function setupRenderEffect(instance, initialVNode, container) {
        effect(() => {
            if (!instance.isMounted) {
                console.log('init');
                const { proxy } = instance
                const subTree = (instance.subTree = instance.render.call(proxy))
                
                // vnode => patch
                patch(null, subTree, container, instance)
                
                // 所有element 都已经 mount => 赋值vnode.el === 组件.$el
                initialVNode.el = subTree.el;

                instance.isMounted = true;
            } else {
                console.log('update');
                const { proxy } = instance
                const subTree = instance.render.call(proxy)
                const prevSubTree = instance.subTree
                instance.subTree = subTree
                
                // vnode => patch
                patch(prevSubTree, subTree, container, instance)
                
                // 所有element 都已经 mount => 赋值vnode.el
                // initialVNode.el = subTree.el;
            }
            
        })
    }

    return {
        createApp: createAppAPI(render)
    }
}