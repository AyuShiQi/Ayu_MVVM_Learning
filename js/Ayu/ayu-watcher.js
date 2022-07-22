import Dep from './ayu-dep';
import Exception from './ayu-exception';
export default class Watcher {
    constructor(scoped, exp, cb) {
        this.scoped = scoped;
        this.exp = exp;
        this.id = Watcher.count++;
        this.cb = cb;
        this.update();
    }
    get() {
        Dep.target = this;
        const newValue = this.calculateExp();
        Dep.target = null;
        return newValue;
    }
    update() {
        this.cb(this.get());
    }
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
Watcher.count = 0;
