/**
 * 消息订阅名单
 */
export default class Dep {
    /**
     * 当前需要订阅Watcher
     */
    static target: any; 
    //存放所有客户名单
    private subs:any;  

    constructor(){
        this.subs = new Map<string,any>();
    }

    /**
     * 存放客户于客户名单
     * @param {*} target 目标客户
     */
    add(target: any): void{
        this.subs.set(target.id,target);
    }

    
    /**
     * 通知所有客户
     */
    notify(){
        for(const sub of this.subs.values()){
            sub.update();
        }
    }
}