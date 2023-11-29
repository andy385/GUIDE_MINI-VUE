import { isProxy, isReadonly, readonly } from '../reactive';
import { vi } from 'vitest'

describe('readonly', () => { 
  it('happy path', () => {
      const original = { foo: 1, bar: { baz: 1 } }
      const wrapped = readonly(original)
      expect(wrapped).not.toBe(original)
      expect(wrapped.foo).toBe(1)
      expect(isReadonly(wrapped)).toBe(true)
      expect(isReadonly(wrapped.bar)).toBe(true)
      expect(isReadonly(original)).toBe(false)
      expect(isReadonly(original.bar)).toBe(false)
      expect(isProxy(wrapped)).toBe(true)
  });

  it('warn then call set', () => {
    console.warn = vi.fn()

    const user = readonly({ age: 10 })

    user.age++

    expect(console.warn).toBeCalled()
  })
 })