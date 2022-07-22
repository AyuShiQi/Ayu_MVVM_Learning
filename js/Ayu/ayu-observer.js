import Dep from './ayu-dep';
import Exception from './ayu-exception';
export default class Observer {
    constructor(data) {
        this.ensureData(data) && this.deepObserve(data);
    }
    ensureData(data) {
        if (typeof data != 'object') {
            Exception.dataTypeError();
            return false;
        }
        return true;
    }
    deepObserve(target) {
        for (const key in target) {
            this.reactiveBinding(target, key, target[key]);
            if (typeof target[key] === 'object' && target[key]) {
                this.deepObserve(target[key]);
            }
        }
    }
    reactiveBinding(obj, key, value) {
        const dep = new Dep();
        Object.defineProperty(obj, key, {
            configurable: false,
            get: () => {
                if (Dep.target)
                    dep.add(Dep.target);
                return value;
            },
            set: (newValue) => {
                value = newValue;
                dep.notify();
            }
        });
    }
}
