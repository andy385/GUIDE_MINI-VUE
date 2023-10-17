import { camelize, toHandleKey } from "../shared/index";

export function emit(instance, event: string, ...args) {
    const { props } = instance;

    const handleName = toHandleKey(camelize(event));

    const handler = props[handleName];

    handler && handler(...args);
}