import Dep from './ayu-dep';
import Exception from './ayu-exception';

/**
 * 数据劫持模块
 */
export default class Observer {
   /**
    * @param {*} data AyuVM.$data
    */
   constructor(data: any){
       this.ensureData(data) && this.deepObserve(data);
   }

   ensureData(data: any){
        if(typeof data != 'object'){
            Exception.dataTypeError();
            return false;
        }

        return true;
   }
   /**
    * 数据的深度劫持
    * @param {*} target 当前遍历的对象
    */
   private deepObserve(target: any): void{
       for (const key in target) {
           // console.log(`${key}: ${propers[key]}`); 

           //数据劫持操作
           this.reactiveBinding(target,key,target[key]);

           //如果该属性是一个对象且不为null，则继续向下绑定
           if (typeof target[key] === 'object' && target[key]) {
               this.deepObserve(target[key]);
           }
       }
   }
    
   /**
    * 使用Object.defineProperty对数据进行绑定劫持
    * @param {*} obj 绑定对象
    * @param {string} key 绑定属性
    * @param {*} value 绑定值 
    */
   private reactiveBinding(obj: any,key: string,value: any): void{
       const dep = new Dep();
       Object.defineProperty(obj,key,{
           //不可重新配置绑定
           configurable: false,
           get: ()=>{
               //消息订阅,如果当前有对象在调用该变量，该对象订阅变量消息
               if(Dep.target) dep.add(Dep.target);
               return value;
           },
           set: (newValue: any) => {
               value = newValue;
               // console.log(key+'被修改为'+newValue);

               //单向绑定,通知当前变量所有订阅客户
               dep.notify();
           }
       });
   }
}