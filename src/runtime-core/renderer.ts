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
        patch(null, vnode, container, null, null)
    }

    // n1 => 老vnode
    // n2 => 新vnode
    function patch(n1, n2, container, parentComponent, anchor) {

        const { type, shapeFlag } = n2;

        switch (type) {
            case Fragment:
                // 只渲染children
                processFragment(n1, n2, container, parentComponent, anchor);
                break;
            case Text:
                processText(n1, n2, container);
                break;

            default:
                if (shapeFlag & ShapeFlags.ELEMENT) {
                    // 处理element
                    processElement(n1, n2, container, parentComponent, anchor)
                } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
                    // 去处理组件
                    processComponent(n1, n2, container, parentComponent, anchor)
                }
                break;
        }

    }

    function processText(n1, n2, container) {
        const { children } = n2;
        const textNode = (n2.el = document.createTextNode(children));
        container.append(textNode);
    }

    function processFragment(n1, n2, container, parentComponent, anchor) {
        mountChildren(n2.children, container, parentComponent, anchor)
    }

    function processElement(n1, n2, container, parentComponent, anchor) {
        if (!n1) {
            mountElement(n1, n2, container, parentComponent, anchor)
        } else {
            patchElement(n1, n2, container, parentComponent, anchor)
        }
    }

    function patchElement(n1, n2, container, parentComponent, anchor) {
        // console.log(n1)
        // console.log(n2)

        const el = (n2.el = n1.el)
        const oldProps = n1.props || EMPTY_OBJ
        const newProps = n2.props || EMPTY_OBJ
        patchProps(el, oldProps, newProps)
        patchChildren(n1, n2, el, parentComponent, anchor)
    }

    function patchChildren(n1, n2, container, parentComponent, anchor) {
        const c1 = n1.children
        const c2 = n2.children
        const prevShapeFlag = n1.shapeFlag
        const shapeFlag = n2.shapeFlag

        if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
            if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
                // 清空老的children
                unmountChildren(n1.children)
            }

            if (c1 !== c2) {
                // 设置新的children
                hostSetElementText(container, c2)
            }
        } else {
            if (prevShapeFlag & ShapeFlags.TEXT_CHILDREN) {
                hostSetElementText(container, '');
                mountChildren(c2, container, parentComponent, anchor)
            } else {
                // array diff array
                patchKeyedChildren(c1, c2, container, parentComponent, anchor)
            }
        }

    }

    function patchKeyedChildren(c1, c2, container, parentComponent, parentAnchor) {
        const l2 = c2.length;
        let i = 0;
        let e1 = c1.length - 1;
        let e2 = l2 - 1;

        function isSameVNodeType(n1, n2) {
            return n1.type === n2.type && n1.key === n2.key;
        }

        // 左侧对比
        while (i <= e1 && i <= e2) {
            const n1 = c1[i]
            const n2 = c2[i]
            if (isSameVNodeType(n1, n2)) {
                patch(n1, n2, container, parentComponent, parentAnchor)
            } else {
                break;
            }
            i++
        }

        // 右侧对比
        while (i <= e1 && i <= e2) {
            const n1 = c1[e1]
            const n2 = c2[e2]

            if (isSameVNodeType(n1, n2)) {
                patch(n1, n2, container, parentComponent, parentAnchor)
            } else {
                break;
            }
            e1--
            e2--
        }

        // 新的比老的多 -> 新增
        if (i > e1) {
            if (i <= e2) {
                const nextPos = e2 + 1;
                const anchor = nextPos < l2 ? c2[nextPos].el : null;
                while (i <= e2) {
                    patch(null, c2[i], container, parentComponent, anchor);
                    i++
                }
            }
        } else if (i > e2) {
            // 老的比新的多 -> 删除
            while (i <= e1) {
                hostRemove(c1[i].el)
                i++
            }
        } else {
            // 中间对比
            const s1 = i;
            const s2 = i;
            let toBePatched = e2 - s2 + 1;
            let patched = 0;

            // 获取新 key合集
            const keyToNewIndex = new Map();

            for (let i = s2; i <= e2; i++) {
                const nextChild = c2[i]
                keyToNewIndex.set(nextChild.key, i)
            }

            for (let i = s1; i <= e1; i++) {

                const prevChild = c1[i]
                let newIndex;

                if(patched >= toBePatched) {
                    hostRemove(prevChild.el)
                    continue;
                }

                if (prevChild.key != null) {
                    newIndex = keyToNewIndex.get(prevChild.key);
                } else {
                    for (let j = s2; j < e2; j++) {
                        if (isSameVNodeType(prevChild, c2[j])) {
                            newIndex = j
                            break
                        }
                    }
                }

                if (newIndex === undefined) {
                    hostRemove(prevChild.el)
                } else {
                    patch(prevChild, c2[newIndex], container, parentComponent, null)
                }

                patched++
            }
        }

    }

    function unmountChildren(children) {
        for (let i = 0; i < children.length; i++) {
            const el = children[i].el
            hostRemove(el)
        }
    }

    function patchProps(el, oldProps, newProps) {
        if (oldProps !== newProps) {
            for (const key in newProps) {
                const pervProp = oldProps[key]
                const nextProp = newProps[key]
                if (pervProp !== nextProp) {
                    hostPatchProp(el, key, pervProp, nextProp)
                }
            }

            if (oldProps !== EMPTY_OBJ) {
                for (const key in oldProps) {
                    if (!(key in newProps)) {
                        console.log(key)
                        hostPatchProp(el, key, oldProps[key], null)
                    }
                }
            }
        }
    }

    function mountElement(n1, n2, container, parentComponent, anchor) {
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
            mountChildren(n2.children, el, parentComponent, anchor)
        }

        hostInsert(el, container, anchor);
    }

    function mountChildren(children, container, parentComponent, anchor) {
        children.forEach(v => {
            patch(null, v, container, parentComponent, anchor);
        });
    }

    function processComponent(n1, n2, container, parentComponent, anchor) {
        mountComponent(n2, container, parentComponent, anchor)
    }

    function mountComponent(initialVNode, container, parentComponent, anchor) {
        const instance: any = createComponentInstance(initialVNode, parentComponent)

        setupComponent(instance)

        setupRenderEffect(instance, initialVNode, container, anchor)
    }

    function setupRenderEffect(instance, initialVNode, container, anchor) {
        effect(() => {
            if (!instance.isMounted) {
                console.log('init');
                const { proxy } = instance
                const subTree = (instance.subTree = instance.render.call(proxy))

                // vnode => patch
                patch(null, subTree, container, instance, anchor)

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
                patch(prevSubTree, subTree, container, instance, anchor)

                // 所有element 都已经 mount => 赋值vnode.el
                // initialVNode.el = subTree.el;
            }

        })
    }

    return {
        createApp: createAppAPI(render)
    }
}