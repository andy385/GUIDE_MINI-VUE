import { camelize, toHandleKey } from "@guide-mini-vue/shared";

export function emit(instance, event: string, ...args) {
    const { props } = instance;

    const handleName = toHandleKey(camelize(event));

    const handler = props[handleName];

    handler && handler(...args);
}