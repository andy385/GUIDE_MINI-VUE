// mini-vue 出口

export * from './runtime-dom'

import { baseCompiler } from './compiler-core/src'
import * as runtimeDom from './runtime-dom'
import { registerRuntimeCompiler } from './runtime-dom'

function compilerToFunction(template) {
    const { code } = baseCompiler(template)
    const render = new Function('Vue', code)(runtimeDom)
    return render
}

registerRuntimeCompiler(compilerToFunction)