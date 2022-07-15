import Dep from './ayu-dep';
import Exception from './ayu-exception';
/**
 * 消息订阅发布观察者模块
 */
export default class Watcher {
    /**
     *
     * @param scoped 作用域，也就是当前框架
     * @param exp 插值计算表达式
     */
    constructor(scoped, exp, cb) {
        this.scoped = scoped;
        this.exp = exp;
        this.id = Watcher.count++;
        this.cb = cb;
        this.update();
    }
    /**
     * 获取插值表达式结果
     * @returns 插值表达式结果
     */
    get() {
        Dep.target = this;
        const newValue = this.calculateExp();
        Dep.target = null;
        return newValue;
    }
    /**
     * 更新结点值
     */
    update() {
        this.cb(this.get());
    }
    /**
     * 计算插值表达式
     * @returns 计算后的结果字符串
     */
    calculateExp() {
        try {
            const fn = new Function(`scoped`, `with(scoped){return ${this.exp};}`);
            return fn(this.scoped);
        }
        catch (e) {
            Exception.syntaxError();
        }
        return '';
    }
}
/**
 * 当前Watcher个数
 */
Watcher.count = 0;
