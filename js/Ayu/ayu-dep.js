export default class Dep {
    constructor() {
        this.subs = new Map();
    }
    add(target) {
        this.subs.set(target.id, target);
    }
    notify() {
        for (const sub of this.subs.values()) {
            sub.update();
        }
    }
}
