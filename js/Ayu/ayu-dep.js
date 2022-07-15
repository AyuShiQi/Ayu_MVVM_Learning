/**
 * 消息订阅名单
 */
export default class Dep {
    constructor() {
        this.subs = new Map();
    }
    /**
     * 存放客户于客户名单
     * @param {*} target 目标客户
     */
    add(target) {
        this.subs.set(target.id, target);
    }
    /**
     * 通知所有客户
     */
    notify() {
        for (const sub of this.subs.values()) {
            sub.update();
        }
    }
}
