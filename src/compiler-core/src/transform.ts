import { NodeTypes } from "./ast"
import { TO_DISPLAY_STRING } from "./runtimeHelps"

export function transform(root, options = {}) {
    const context = createTransformContext(root, options)
    // 遍历-深度优先搜索
    traverseNode(root, context)

    createCodegenNode(root)

    root.helpers = [...context.helpers.keys()]
}

function createCodegenNode(root: any) {
    const child = root.children[0]
    if (child.type === NodeTypes.ELEMENT) {
        root.codegenNode = child.codegenNode
    } else {
        root.codegenNode = root.children[0]
    }
}

function createTransformContext(root: any, options: any) {
    const context = {
        root,
        nodeTransforms: options.nodeTransforms || [],
        helpers: new Map(),
        helper(key) {
            context.helpers.set(key, 1)
        }
    }

    return context
}


function traverseNode(node: any, context) {

    let exitFns: any = []
    const nodeTransforms = context.nodeTransforms
    for (let i = 0; i < nodeTransforms.length; i++) {
        const transform = nodeTransforms[i];
        const onExit = transform(node, context)
        if (onExit) exitFns.push(onExit)
    }

    switch (node.type) {
        case NodeTypes.INTERPOLATION:
            context.helper(TO_DISPLAY_STRING)
            break;
        case NodeTypes.ROOT:
        case NodeTypes.ELEMENT:
            traverseChildren(node, context)
            break;

        default:
            break;
    }

    let i = exitFns.length
    while(i--) {
        exitFns[i]()
    }

}

function traverseChildren(node: any, context: any) {
    const children = node.children
    for (let i = 0; i < children.length; i++) {
        const node = children[i]

        traverseNode(node, context)

    }
}
