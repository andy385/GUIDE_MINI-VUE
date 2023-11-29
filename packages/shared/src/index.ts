export * from './toDisplayString'
export { ShapeFlags } from './ShapeFlags'

export const extend = Object.assign;

export const isObject = (val) => {
  return val !== null && typeof val === 'object';
}

export const isString = (val) => typeof val === 'string';

export const hasChange = (newVal, val) => {
  return !Object.is(newVal, val)
}

export const hasOwn = (target, key) => {
  return Object.prototype.hasOwnProperty.call(target, key)
}

export const camelize = (str: string) => {
  return str.replace(/-(\w)/g, (_, c: string) => {
    return c ? c.toLocaleUpperCase(): '';
  })
}

const capitalize = (str: string) => {
  return str.charAt(0).toLocaleUpperCase() + str.slice(1);
}

export const toHandleKey = (str: string) => {
  return str ? 'on' + capitalize(str) : '';
}

export const EMPTY_OBJ = {};