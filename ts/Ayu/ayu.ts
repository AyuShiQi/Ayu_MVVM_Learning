import Observer from './ayu-observer';
import Compiler from './ayu-compiler';
import Exception from './ayu-exception';

/**
 * MVVM框架
 */
const ayu = class Ayu {
    private static id: number = 0;
    /**
     * 存储所有Ayu对象
     */
    private static readonly ayus = new Map<number,any>();
    /**
     * 当前Ayu对象编号 
     */
    $id: number;
    /**
     * MVVM root节点
     */
    $el: any; 
    /**
     * 数据
     */
    $data: any;
    /**
     * 方法
     */
    $methods: any;


    /**
     * 生成VM框架
     * @param {*} config 传入的配置对象
     */
    constructor(config: any){
        this.$id = ++Ayu.id;
        Ayu.ayus.set(this.$id,this);

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
    static get(id: number): any{
        return Ayu.ayus.get(id);
    }

    /**
     * 某Ayu对象是否存在
     * @param id 
     * @returns 是否存在
     */
    static has(id: number): boolean{
        return Ayu.ayus.has(id);
    }
      
    
    /**
     * 数据绑定 
     * @param {*} config 配置参数
     */
    private binding(config: any): void{
        //获取绑定结点el
        this.bindEL(config);

        //绑定data源数据,不可重新修改
        Object.defineProperty(this,'$data',{
            configurable: false,
            writable: false,
            value: config.data ?? {}
        });

        //绑定方法函数
        this.$methods = config.methods ?? {};
    }


    /**
     * 绑定容器
     * @param config 配置参数
     */
    private bindEL(config: any): void{
        if(!config.el) {
            Exception.nullElError();
        }
        if(!document.querySelector(config.el)){
            Exception.elBindingNullError();
        }

        this.$el = document.querySelector(config.el);   
    }


    /**
     * 数据及方法代理
     */
    private proxy(): void{
        this.datasProxy(this,this.$data);
        this.methodsProxy(this,this.$methods);
    }


    /**
     * 数据代理
     * @param {*} target vm模型，绑定目标
     * @param {*} data $data对象，代理对象
     */
    private datasProxy(target: any,data: any): void{
        for(const key in data){
            Object.defineProperty(target,key,{
                configurable: false,
                get: ()=>{
                    return data[key];
                },
                set: (newValue: any)=>{
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
    private methodsProxy(target: any,methods: any): void{
        for(const key in methods){
            target[key] = methods[key];
        }
    }
}

Object.defineProperty(window,'Ayu',{
    value: ayu
});

