import Utils from './ayu-utils';
import Watcher from './ayu-watcher';
import Exception from './ayu-exception';

/**
 * 模板编译模块
 */
export default class Compiler{
    /**
     * 当前Ayu对象
     */
    private _context: any;
    /**
     * AyuVM.$el
     */
    private _el: any;
    /**
     * 虚拟DOM
     */
    private _fragment: any;
    


    /**
     * @param ayu AyuVM
     */
    constructor(ayu: any){
        this.ensureRoot(ayu.$el);
        //转存VM对象
        this._context = ayu;
        //转存el
        this._el = ayu.$el;

        this._fragment = this.moveNodeToFragment(this._el);
        this.compile(this._fragment);
        this._el.appendChild(this._fragment);
    }


    /**
     * 确保el所在位置正确
     * @param el ayu.$el
     */
    ensureRoot(el: any){
        if(el === document.body || el === document.documentElement){
            Exception.elBindingError();
        }
    }

    /**
     * 编译模板
     * @param {*} template 需要编译的模板
     */
    compile(template: any): void{
        if(!template.childNodes) return;
        template.childNodes.forEach((childNode: any) => {
            //文本结点
            if(childNode.nodeType === 3){
                this.compileText(childNode);
            }

            //元素结点
            if(childNode.nodeType === 1){
                this.compileElement(childNode);
            }
        });
    }

    /**
     * 编译文本
     * @param {*} node 文本节点
     */
    private compileText(node: any): void{
        //获取表达式
        const exp = this.matchValue(node.textContent.trim());

        //消息订阅发布模式实现
        new Watcher(this._context,exp,function(newContext: string){
            node.textContent = newContext;
        });
    }

    /**
     * 编译元素节点
     * @param {*} node 
     */
    private compileElement(node: any): void{

        for(const attr of node.attributes){
            //匹配内置指令
            this.mathchCommand(node,attr);
            //匹配事件
            this.matchEvent(node,attr);
        }

        // 继续向下遍历
        this.compile(node);
    }

    /**
     * 匹配内置普通指令语法
     * @param {*} node 需匹配的元素节点
     * @param {*} attr 属性
     */
    private mathchCommand(node: any,attr: any){
        //匹配单向绑定
        if(this.isBinding(attr.name)){
            Command.vBind(node,attr,this._context);
        }
        else {
            //匹配内置指令
            switch(attr.name){
                case 'v-text':
                    Command.vText(node,this._context,attr.value);
                    break;
                case 'v-html':
                    Command.vHtml(node,this._context,attr.value);
                    break;
                case 'v-model':
                    Command.vModel(node,this._context,attr.value);
                    break;
                case 'v-lazy':
                    Command.vLazy(node,this._context,attr.value);
                    break;
            }
        }

    }

    isBinding(name: string): boolean{
        const reg = /^(v-bind)*:/;

        return reg.test(name);
    }

    /**
     * 匹配内置事件指令
     * @param {*} node 需匹配的元素节点
     * @param {*} attr 当前待匹配属性
     */
    private matchEvent(node: any,attr: any){
        switch(attr.name){
            //点击事件
            case '@click':
                node.addEventListener('click',(e: any)=>{
                    this.triggerMethod(attr.value,e);
                });
                break;
            //鼠标经过事件
            case '@mouseover':
                node.addEventListener('mouseover',(e: any)=>{
                    this.triggerMethod(attr.value,e);
                });
                break;
            //鼠标移出事件
            case '@mouseout':
                node.addEventListener('mouseout',(e: any)=>{
                    this.triggerMethod(attr.value,e);
                });
                break;
            //鼠标移动事件
            case '@mousemove':
                node.addEventListener('mousemove',(e: any)=>{
                    this.triggerMethod(attr.value,e);
                });
                break;
            case '@keypress':
                node.addEventListener('keypress',(e: any)=>{
                    this.triggerMethod(attr.value,e);
                });
        }
    }

    /**
     * 触发相关函数
     * @param {string} exp 函数表达式
     */
    triggerMethod(exp: string,e: any): void{
        //匹配参数列表括号
        const reg = /\(.*?\)$/;
        const paramsList = exp.match(reg);
        const methodName = (exp.trim().split(reg))[0];
        if(!methodName) {
            Exception.nullMethodWarning();
            return;
        }
        
        try{

            // 触发不带括号的函数，自动添加e事件对象调用
            if(!paramsList) {
                (new Function(`scoped,e`,`with(scoped){
                    return ${methodName}(e);
                }`
                ))(this._context,e);
            }
            // 触发到括号为空的函数，直接触发
            else if(paramsList[0].includes('()')){
                (new Function(`scoped,e`,`with(scoped){
                    return ${methodName}();
                }`
                ))(this._context);
            }
            //触发含形参列表的函数
            else {
                (new Function(`scoped,e`,`with(scoped){ 
                    return ${methodName}${paramsList[0]}; 
                }`
                ))(this._context,e);
            }

        } catch {
            Exception.callMethodError();
        }
    }

    /**
     * 匹配插值语法
     * @param {string} text 需匹配的模板
     * @return 模板字符串表达式
     */
    private matchValue(text: string): string{
        text = Utils.deleteBlank(text);
        //匹配插值
        const reg = /\{\{(.*?)\}\}/g;

        //插值匹配结果
        const matches = text.match(reg);
        // 分割结果
        const allPart = text.split(reg);
        // console.log(matches);
        // console.log(allPart);

        let i = 0;  //递增变量,matches的
        const result: Array<string> = []; //取值结果
        allPart.forEach((part)=>{
            if(matches && matches[i] === '') i++;

            //如果分割结果为插值语法里的值
            if(matches && matches.length > i && matches[i].indexOf(`{{${part}}}`) > -1){
                //保证插值里不是空的{{}}
                if(part!=''){
                    result.push(`(${part})`);
                }
                else {
                    Exception.nullInterpolationWarning();
                }

                i++;
            }
            else {
                result.push(`"${part}"`);
            }
        });

        return result.join(`+`);
    }

    /**
     * 把节点移动到Fragment中去
     * @param {*} node $el
     * @returns {*} 返回一个fragment
     */
    private moveNodeToFragment(node: any): any{
        if(!node.childNodes) return;

        let fragment = document.createDocumentFragment();

        //转存
        while(node.childNodes.length!=0){
            fragment.appendChild(node.childNodes[0]);
        }

        return fragment;
    }
}


/**
 * 内置指令
 */
class Command {
    private constructor(){}


    /**
     * v-bind 单向绑定
     * @param {*} node 节点
     * @param {*} attr 属性
     * @param {*} scoped 作用域
     */
    static vBind(node: any,attr: any,scoped: any): void{
        const reg = /^(v-bind)*:/;
        let part = attr.name.split(reg);
        const attrName = part[part.length-1];

        new Watcher(scoped,attr.value,function(newValue: string){
            try{
                node.setAttribute(attrName,newValue);
            }
            catch {
                Exception.attributeBindingError();
            }
        });
    }

    /**
     * v-text 写入innerText
     * @param {*} node 节点
     * @param {*} scoped 作用域
     * @param {*} value 绑定的数据
     */
    static vText(node: any,scoped: any,value: any): void{
        new Watcher(scoped,value,function(newValue: string){
            node.innerText = newValue;
        });
    }


    /**
     * v-html 写入innerHext
     * @param {*} node 节点
     * @param {*} scoped 作用域
     * @param {*} value 绑定的数据
     */
    static vHtml(node: any,scoped: any,value: any): void{
        new Watcher(scoped,value,function(newValue: string){
            node.innerHTML = newValue;
        });
    }

    /**
     * 双向绑定 v-model
     * @param {*} node 节点
     * @param {*} scoped 作用域
     * @param {string} value 绑定的数据
     * 
     */
    static vModel(node: any,scoped: any,value: string): void{
        // 用于双向绑定中View到Modle过程
        const cb = new Function(`value,scoped`,`with(scoped){${value} = value;}`);

        new Watcher(scoped,value,function(newValue: string){
            node.value = newValue;
        });

        node.addEventListener('input',(e: any) =>{
            cb(e.target.value,scoped);
        });
    }

    /**
     * 双向懒绑定
     * @param {*} node 节点
     * @param {*} scoped 作用域
     * @param {string} value 属性
     */
    static vLazy(node: any,scoped: any,value: string): void{
        // 用于双向绑定中View到Modle过程
        const cb = new Function(`value,scoped`,`with(scoped){${value} = value;}`);

        new Watcher(scoped,value,function(newValue: string){
            node.value = newValue;
        });

        node.addEventListener('keypress',(e: any) =>{
            if(e.keyCode == "13"){
                cb(e.target.value,scoped);
            }
        });

        node.addEventListener('blur',(e: any) =>{
            cb(e.target.value,scoped);
        });
    }
}