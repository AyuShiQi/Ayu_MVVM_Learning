export default class Exception {
    static nullInterpolationWarning() {
        console.warn('[from Ayu]: 插值模板中内容为空，请确保没有漏写！');
    }
    static nullMethodWarning() {
        console.warn('[from Ayu]: 你没有绑定触发事件调用函数！');
    }
    static dataTypeError() {
        console.error('[from Ayu]：警告！传入的data应该为一个对象');
    }
    static syntaxError() {
        console.error('[from Ayu]: 语法出现错误');
        console.warn('请检查模板语法是否正确，引用变量是否存在？');
        console.warn('如若使用v-text时,请确保插入字符串中没有英文\"\"或者英文\'\'');
    }
    static callMethodError() {
        console.error('[from Ayu]: 在@click等事件触发指令中，只能调用函数，不能直接写入代码！！如果你需要进行一些操作，请将相应语法封装入函数中进行调用。');
        console.error('[from Ayu]: 函数调用失败，请您检查函数名及参数是否传入正确！');
    }
    static attributeBindingError() {
        console.error('[from Ayu]: v-bind指令绑定属性失败，请检查绑定语法是否正确，属性格式是否正确');
    }
    static nullElError() {
        console.error('[from Ayu]: 你没有传入el配置参数');
    }
    static elBindingNullError() {
        console.error('[from Ayu]: el绑定失败，请确保你传入的el配置参数是正确的！');
    }
    static elBindingError() {
        console.error('[from Ayu]: 请不要将根节点设置在<html>或<body>标签上，否则会出现错误！');
    }
}
