import Dep from './ayu-dep';
import Exception from './ayu-exception';

/**
 * 消息订阅发布观察者模块
 */
export default class Watcher {
    /**
     * 当前Watcher个数
     */
    static count: number = 0;
    /**
     * 当前Watcher编号
     */
    id: number;
    /**
     * 该Watcher作用域
     */
    scoped: any;
    /**
     * 表达式
     */
    exp: string;
    /**
     * 回调函数
     */
    cb: any;

    /**
     * 
     * @param scoped 作用域，也就是当前框架
     * @param exp 插值计算表达式
     */
    constructor(scoped: any,exp: string,cb: any){
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
    get(): string{
        Dep.target = this;
        const newValue = this.calculateExp();
        Dep.target = null;

        return newValue;
    }

    /**
     * 更新结点值
     */
    update(): void{
        this.cb(this.get());
    }


    /**
     * 计算插值表达式
     * @returns 计算后的结果字符串
     */
    private calculateExp(): string{
        try {
            const fn = new Function(`scoped`,`with(scoped){return ${this.exp};}`);
            return fn(this.scoped);
        }
        catch(e) {
            Exception.syntaxError();
        }

        return '';
    } 
}