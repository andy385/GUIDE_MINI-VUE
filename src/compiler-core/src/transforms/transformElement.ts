import { NodeTypes, createVNodeCall } from "../ast";
import { CREATE_ELEMENT_VNODE } from "../runtimeHelps";

export function transformElement(node, context) {
    if (node.type === NodeTypes.ELEMENT) {
        return () => {
            // 中间处理层
            // tag
            const vnodeTag = `'${node.tag}'`
            // prop
            let vnodeProps

            const children = node.children
            const vnodeChildren = children[0]

            node.codegenNode = createVNodeCall(context, vnodeTag, vnodeProps, vnodeChildren)
        }

    }

}