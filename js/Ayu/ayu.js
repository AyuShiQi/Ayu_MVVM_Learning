var _a;
import Observer from './ayu-observer';
import Compiler from './ayu-compiler';
import Exception from './ayu-exception';
/**
 * MVVM框架
 */
const ayu = (_a = class Ayu {
        /**
         * 生成VM框架
         * @param {*} config 传入的配置对象
         */
        constructor(config) {
            this.$id = ++Ayu.id;
            Ayu.ayus.set(this.$id, this);
            this.binding(config);
            this.proxy();
            //数据劫持
            new Observer(this.$data);
            config.created && config.created();
            //模板编译
            new Compiler(this);
            config.mounted && config.mounted();
        }
        /**
         * 获取某Ayu对象
         * @param id
         * @returns ayu对象
         */
        static get(id) {
            return Ayu.ayus.get(id);
        }
        /**
         * 某Ayu对象是否存在
         * @param id
         * @returns 是否存在
         */
        static has(id) {
            return Ayu.ayus.has(id);
        }
        /**
         * 数据绑定
         * @param {*} config 配置参数
         */
        binding(config) {
            var _a, _b;
            //获取绑定结点el
            this.bindEL(config);
            //绑定data源数据,不可重新修改
            Object.defineProperty(this, '$data', {
                configurable: false,
                writable: false,
                value: (_a = config.data) !== null && _a !== void 0 ? _a : {}
            });
            //绑定方法函数
            this.$methods = (_b = config.methods) !== null && _b !== void 0 ? _b : {};
        }
        /**
         * 绑定容器
         * @param config 配置参数
         */
        bindEL(config) {
            if (!config.el) {
                Exception.nullElError();
            }
            if (!document.querySelector(config.el)) {
                Exception.elBindingNullError();
            }
            this.$el = document.querySelector(config.el);
        }
        /**
         * 数据及方法代理
         */
        proxy() {
            this.datasProxy(this, this.$data);
            this.methodsProxy(this, this.$methods);
        }
        /**
         * 数据代理
         * @param {*} target vm模型，绑定目标
         * @param {*} data $data对象，代理对象
         */
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
        /**
         * 方法代理
         * @param {*} target 绑定目标
         * @param {*} methods $methods对象，代理对象
         */
        methodsProxy(target, methods) {
            for (const key in methods) {
                target[key] = methods[key];
            }
        }
    },
    _a.id = 0,
    /**
     * 存储所有Ayu对象
     */
    _a.ayus = new Map(),
    _a);
Object.defineProperty(window, 'Ayu', {
    value: ayu
});
