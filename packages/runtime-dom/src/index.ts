import { createRenderer } from "@guide-mini-vue/runtime-core";

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

function insert(child, parent, anchor) {
    // console.log('insert ====')
    parent.insertBefore(child, anchor || null);
}

function remove(child) {
    const parent = child.parentNode;
    if(parent) {
        parent.removeChild(child);
    }
}

function setElementText(el, text) {
    el.textContent = text;
}

const renderer: any = createRenderer({
    createElement,
    patchProp,
    insert,
    remove,
    setElementText
})

export function createApp(...args) {
    return renderer.createApp(...args)
}

export * from '@guide-mini-vue/runtime-core'