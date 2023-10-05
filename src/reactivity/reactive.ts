import { mutableHandlers, readonlyHandlers } from './baseHandlers'

export const enum ReactiveFlags {
    IS_REACTIVE = '__v_is_reactive',
    IS_READONLY = '__v_is_readonly'
}

export function reactive(raw) {
    return createActiveObject(raw, mutableHandlers)
}

export function readonly(raw) {
    return createActiveObject(raw, readonlyHandlers)
}

function createActiveObject(raw, baseHandlers: any) {
    return new Proxy(raw, baseHandlers)
}

export function isReactive(value) {
    return !!value[ReactiveFlags.IS_REACTIVE]
}

export function isReadonly(value) {
    return !!value[ReactiveFlags.IS_READONLY]
}