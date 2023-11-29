import { isString } from "../../shared"
import { NodeTypes } from "./ast"
import { CREATE_ELEMENT_VNODE, TO_DISPLAY_STRING, helperMapName } from "./runtimeHelps"

export function generate(ast) {
    const context = createCodegenContext()
    const { push } = context


    genFunctionPreamble(ast, context)

    const functionName = 'render'
    const args = ['_ctx', '_cache']
    const signature = args.join(', ')

    push(`function ${functionName} (${signature}) {\n`)
    push(`    return `)
    genNode(ast.codegenNode, context)
    push('  }')

    return {
        code: context.code
    }
}

function genFunctionPreamble(ast: any, context: any) {
    const { push } = context
    const VueBinging = `Vue;\n`
    const aliasHelper = (s) => `${helperMapName[s]}: _${helperMapName[s]}`
    if (ast.helpers.length > 0) {
        push(`const { ${ast.helpers.map(aliasHelper).join(', ')} } = ${VueBinging} `)
    }
    push('return ')
}

function createCodegenContext() {
    const context = {
        code: '',
        push(source) {
            context.code += source
        },
        helper(key) {
            return `_${helperMapName[key]}`
        }
    }

    return context
}

function genNode(node: any, context: any) {

    switch (node.type) {
        case NodeTypes.TEXT:
            genText(node, context)
            break;
        case NodeTypes.INTERPOLATION:
            genInterpolation(node, context)
            break;
        case NodeTypes.SIMPLE_EXPRESSION:
            genExpression(node, context)
            break;
        case NodeTypes.ELEMENT:
            genElement(node, context)
            break;
        case NodeTypes.COMPOUND_EXPRESSION:
            genCompoundExpression(node, context)

        default:
            break;
    }

}

function genCompoundExpression(node: any, context: any) {
    const { children } = node
    const { push } = context
    for (let i = 0; i < children.length; i++) {
        const child = children[i];
        if (isString(child)) {
            push(child)
        } else {
            genNode(child, context)
        }
        
    }
}

function genElement(node: any, context: any) {
    const { push, helper } = context
    const { tag, props, children } = node
    push(`${helper(CREATE_ELEMENT_VNODE)}(`)
    genNodeList(genNullable([tag, props, children]), context)
    push(')')
    // genNode(children, context)
    // for(let i = 0; i < children.length; i++) {
    //     const child = children[i]
    //     genNode(child, context)
    // }
}

function genNodeList(nodes: any, context: any) {
    const { push } = context
    for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        if (isString(node)) {
            push(node)
        } else {
            genNode(node, context)
        }

        if (i < nodes.length - 1) {
            push(', ')
        }
    }
}

function genNullable(args) {
    return args.map((arg) => arg || "null")
}

function genExpression(node, context) {
    const { push } = context
    push(`${node.content}`)
}

function genInterpolation(node, context) {
    const { push, helper } = context
    push(`${helper(TO_DISPLAY_STRING)}(`)
    genNode(node.content, context)
    push(')')
}

function genText(node, context) {
    const { push } = context
    const content = node.content
    push(`'${content}'\n`)
}