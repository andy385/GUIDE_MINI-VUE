import { track, trigger } from './effect'
import { ReactiveFlags } from './reactive'

const get = createGetter()
const set = createSetter()
const readonlyGet = createGetter(true)

function createGetter(isReadonly = false) {
  return function get(target, key) {

    if (key === ReactiveFlags.IS_REACTIVE) {
      return !isReadonly
    } else if (key === ReactiveFlags.IS_READONLY) {
      return isReadonly
    }

    if (!isReadonly) {
        track(target, key)
    }
    return Reflect.get(target, key)
  }
}

function createSetter() {
  return function set(target, key, value) {
    const result = Reflect.set(target, key, value)
      // 触发依赖
      trigger(target, key)
      return result
  }
}

export const mutableHandlers = {
  get,
  set
}

export const readonlyHandlers = {
  get: readonlyGet,
  set(target, key, value) {
    console.warn(`key: ${key} is readonly`)
    return true
  }
}