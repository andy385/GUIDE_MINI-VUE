class reactiveEffect {
    private _fn: any

    constructor(fn, public scheduler?) {
        this._fn = fn
    }

    run() {
        activeEffect = this
        return this._fn()
    }
}

export function effect(fn, options: any = {}) {
    const _effect = new reactiveEffect(fn, options.scheduler)

    _effect.run()

    return _effect.run.bind(_effect)
}

let activeEffect;
let targetMap = new Map()

export function track(target, key) {
    // target -> key -> dep

    let depsMap = targetMap.get(target)
    if (!depsMap) {
        depsMap = new Map()
        targetMap.set(target, depsMap)
    }

    let dep = depsMap.get(key)
    if (!dep) {
        dep = new Set()
        depsMap.set(key, dep)
    }

    dep.add(activeEffect)

}

export function trigger(target, key) {
    const depsMap = targetMap.get(target)

    const dep = depsMap.get(key)

    dep.forEach((effect) => {
        if (effect.scheduler) {
            effect.scheduler()
        } else {
            effect.run()
        }
    })
}

