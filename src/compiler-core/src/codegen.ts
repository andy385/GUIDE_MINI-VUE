export function generate(ast) {
    const context = createCodegenContext()
    const { push } = context
    push('return ')

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

function createCodegenContext() {
    const context =  {
        code: '',
        push(source) {
            context.code += source
        }
    }

    return context
}

function genNode(node: any, context: any) {
    const { push } = context
    const content = node.content
    push(`${content}\n`)
}