// mini-vue 出口

export * from '@guide-mini-vue/runtime-dom'

import { baseCompiler } from '@guide-mini-vue/compiler-core'
import * as runtimeDom from '@guide-mini-vue/runtime-dom'
import { registerRuntimeCompiler } from '@guide-mini-vue/runtime-dom'

function compilerToFunction(template) {
    const { code } = baseCompiler(template)
    const render = new Function('Vue', code)(runtimeDom)
    return render
}

registerRuntimeCompiler(compilerToFunction)