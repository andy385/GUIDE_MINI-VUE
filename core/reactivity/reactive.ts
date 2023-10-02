import { track, trigger } from "./effect"

export function reactive(raw) {
    return new Proxy(raw, {
        get(target, key) {
            // 收集依赖
            track(target, key)
            return Reflect.get(target, key)

        },

        set(target, key, value) {

            const result = Reflect.set(target, key, value)
            
            // 触发依赖
            trigger(target, key)

            return result
        }
    })
}