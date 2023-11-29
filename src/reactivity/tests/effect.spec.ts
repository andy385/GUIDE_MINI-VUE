import { reactive } from "../reactive";
import { effect, stop } from "../effect";
import { vi } from 'vitest'

describe("effect", () => {
    it("happy path", () => {
        const user = reactive({
            age: 10,
        });
        let nextAge;

        effect(() => {
            nextAge = user.age + 1;
        });
        expect(nextAge).toBe(11);

        // update
        user.age++;
        expect(nextAge).toBe(12);
    });

    it('should return runner when call effect', () => {
        // runner  运行effect -> runner函数 -> 运行fn , 返回fn return值
        let foo = 1;
        const runner = effect(() => {
            foo++
            return 'foo'
        })

        expect(foo).toBe(2)
        const r = runner()
        expect(foo).toBe(3)
        expect(r).toBe('foo')
    });

    it('scheduler', () => {
        let dummy;
        let run: any;
        const obj = reactive({ foo: 1 })
        const scheduler = vi.fn(() => {
            run = runner
        })

        const runner = effect(
            () => {
                dummy = obj.foo;
            },
            { scheduler }
        )

        expect(scheduler).not.toHaveBeenCalled()
        expect(dummy).toBe(1);
        obj.foo++
        expect(dummy).toBe(1)
        expect(scheduler).toBeCalledTimes(1)
        run()
        expect(dummy).toBe(2)

    })
    
    it('stop', () => {
        let dummy;
        const obj = reactive({ prop: 1 })
        const runner = effect(() => {
            dummy = obj.prop
        })
        obj.prop = 2
        expect(dummy).toBe(2)
        // deps 中清除effect
        stop(runner)
        // obj.prop = 3
        obj.prop++ // obj.prop = obj.prop + 1
        expect(dummy).toBe(2)

        runner()
        expect(dummy).toBe(3)
    })

    it('onStop', () => {
        const obj = reactive({
            foo: 1
        })
        let onStop = vi.fn()
        let dummy
        const runner = effect(
            () => {
            dummy = obj.foo
            },
            { onStop }
        )

        stop(runner)
        expect(onStop).toBeCalledTimes(1)
    });
});
