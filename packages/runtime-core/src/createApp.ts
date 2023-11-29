import { createVNode } from "./vnode"


export function createAppAPI(render) {

    return function createApp(rootComponent) {
        return {
            mount(rootContainer) {
                // 先转换成vnode
                // 后续操作都基于vnode
                const vnode = createVNode(rootComponent)
    
                render(vnode, rootContainer)
            }
        }
    }
}