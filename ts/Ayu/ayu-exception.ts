/**
 * 异常信息
 */
export default class Exception {    
    /**
     * 插值语法空值警告
     */
    static nullInterpolationWarning(): void{
        console.warn('[from Ayu]: 插值模板中内容为空，请确保没有漏写！');
    }

    /**
     * 函数调用为空警告
     */
    static nullMethodWarning(): void{
        console.warn('[from Ayu]: 你没有绑定触发事件调用函数！');
    }

    static dataTypeError(): void {
        console.error('[from Ayu]：警告！传入的data应该为一个对象');
    }

    /**
     * Ayu语法错误
     */
    static syntaxError(): void{
        console.error('[from Ayu]: 语法出现错误');
        console.warn('请检查模板语法是否正确，引用变量是否存在？');
        console.warn('如若使用v-text时,请确保插入字符串中没有英文\"\"或者英文\'\'');
    }

    /**
     * 函数调用错误
     */
    static callMethodError(): void{
        console.error('[from Ayu]: 在@click等事件触发指令中，只能调用函数，不能直接写入代码！！如果你需要进行一些操作，请将相应语法封装入函数中进行调用。');
        console.error('[from Ayu]: 函数调用失败，请您检查函数名及参数是否传入正确！');
    }

    /**
     * v-bind绑定错误
     */
    static attributeBindingError(): void{
        console.error('[from Ayu]: v-bind指令绑定属性失败，请检查绑定语法是否正确，属性格式是否正确');
    }

    /**
     * el空值错误
     */
    static nullElError(): void{
        console.error('[from Ayu]: 你没有传入el配置参数');
    }

    /**
     * el绑定失败错误
     */
    static elBindingNullError(): void{
        console.error('[from Ayu]: el绑定失败，请确保你传入的el配置参数是正确的！');
    }

    /**
     * el绑定位置错误
     */
    static elBindingError(): void{
        console.error('[from Ayu]: 请不要将根节点设置在<html>或<body>标签上，否则会出现错误！');
    }

}