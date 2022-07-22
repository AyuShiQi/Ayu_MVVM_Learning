import Observer from './ayu-observer';
import Compiler from './ayu-compiler';
import Exception from './ayu-exception';
export default class Ayu {
    constructor(config) {
        this.$id = ++Ayu.id;
        Ayu.ayus.set(this.$id, this);
        this.binding(config);
        this.proxy();
        new Observer(this.$data);
        config.created && (config.created.bind(this))();
        new Compiler(this);
        config.mounted && (config.mounted.bind(this))();
    }
    static get(id) {
        return Ayu.ayus.get(id);
    }
    static has(id) {
        return Ayu.ayus.has(id);
    }
    binding(config) {
        var _a, _b;
        this.bindEL(config);
        Object.defineProperty(this, '$data', {
            configurable: false,
            writable: false,
            value: (_a = config.data) !== null && _a !== void 0 ? _a : {}
        });
        this.$methods = (_b = config.methods) !== null && _b !== void 0 ? _b : {};
    }
    bindEL(config) {
        if (!config.el) {
            Exception.nullElError();
        }
        if (!document.querySelector(config.el)) {
            Exception.elBindingNullError();
        }
        this.$el = document.querySelector(config.el);
    }
    proxy() {
        this.datasProxy(this, this.$data);
        this.methodsProxy(this, this.$methods);
    }
    datasProxy(target, data) {
        for (const key in data) {
            Object.defineProperty(target, key, {
                configurable: false,
                get: () => {
                    return data[key];
                },
                set: (newValue) => {
                    data[key] = newValue;
                }
            });
        }
    }
    methodsProxy(target, methods) {
        for (const key in methods) {
            target[key] = methods[key];
        }
    }
}
Ayu.id = 0;
Ayu.ayus = new Map();
