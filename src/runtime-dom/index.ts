import { createRenderer } from "../runtime-core";

function createElement(type) {
    // console.log('createElement ====')
    return document.createElement(type)
}

function patchProp(el, key, prevVal, nextVal) {
    // console.log('patchProp ====')
    const isOn = (key) => /^on[A-Z]/.test(key)
    // 处理 event
    if (isOn(key)) {
        const event = key.slice(2).toLocaleLowerCase();
        el.addEventListener(event, nextVal)
    } else {
        if(nextVal === undefined || nextVal === null) {
            el.removeAttribute(key)
        } else {
            el.setAttribute(key, nextVal);
        }
    }
}

function insert(el, parent) {
    // console.log('insert ====')
    parent.append(el);
}

const renderer: any = createRenderer({
    createElement,
    patchProp,
    insert
})

export function createApp(...args) {
    return renderer.createApp(...args)
}

export * from '../runtime-core'