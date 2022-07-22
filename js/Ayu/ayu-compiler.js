import Utils from './ayu-utils';
import Watcher from './ayu-watcher';
import Exception from './ayu-exception';
export default class Compiler {
    constructor(ayu) {
        this.ensureRoot(ayu.$el);
        this._context = ayu;
        this._el = ayu.$el;
        this._fragment = this.moveNodeToFragment(this._el);
        this.compile(this._fragment);
        this._el.appendChild(this._fragment);
    }
    ensureRoot(el) {
        if (el === document.body || el === document.documentElement) {
            Exception.elBindingError();
        }
    }
    compile(template) {
        if (!template.childNodes)
            return;
        template.childNodes.forEach((childNode) => {
            if (childNode.nodeType === 3) {
                this.compileText(childNode);
            }
            if (childNode.nodeType === 1) {
                this.compileElement(childNode);
            }
        });
    }
    compileText(node) {
        const exp = this.matchValue(node.textContent.trim());
        new Watcher(this._context, exp, function (newContext) {
            node.textContent = newContext;
        });
    }
    compileElement(node) {
        for (const attr of node.attributes) {
            this.mathchCommand(node, attr);
            this.matchEvent(node, attr);
        }
        this.compile(node);
    }
    mathchCommand(node, attr) {
        if (this.isBinding(attr.name)) {
            Command.vBind(node, attr, this._context);
        }
        else {
            switch (attr.name) {
                case 'v-text':
                    Command.vText(node, this._context, attr.value);
                    break;
                case 'v-html':
                    Command.vHtml(node, this._context, attr.value);
                    break;
                case 'v-model':
                    Command.vModel(node, this._context, attr.value);
                    break;
                case 'v-lazy':
                    Command.vLazy(node, this._context, attr.value);
                    break;
            }
        }
    }
    isBinding(name) {
        const reg = /^(v-bind)*:/;
        return reg.test(name);
    }
    matchEvent(node, attr) {
        switch (attr.name) {
            case '@click':
                node.addEventListener('click', (e) => {
                    this.triggerMethod(attr.value, e);
                });
                break;
            case '@mouseover':
                node.addEventListener('mouseover', (e) => {
                    this.triggerMethod(attr.value, e);
                });
                break;
            case '@mouseout':
                node.addEventListener('mouseout', (e) => {
                    this.triggerMethod(attr.value, e);
                });
                break;
            case '@mousemove':
                node.addEventListener('mousemove', (e) => {
                    this.triggerMethod(attr.value, e);
                });
                break;
            case '@keypress':
                node.addEventListener('keypress', (e) => {
                    this.triggerMethod(attr.value, e);
                });
        }
    }
    triggerMethod(exp, e) {
        const reg = /\(.*?\)$/;
        const paramsList = exp.match(reg);
        const methodName = (exp.trim().split(reg))[0];
        if (!methodName) {
            Exception.nullMethodWarning();
            return;
        }
        try {
            if (!paramsList) {
                (new Function(`scoped,e`, `with(scoped){
                    return ${methodName}(e);
                }`))(this._context, e);
            }
            else if (paramsList[0].includes('()')) {
                (new Function(`scoped,e`, `with(scoped){
                    return ${methodName}();
                }`))(this._context);
            }
            else {
                (new Function(`scoped,e`, `with(scoped){ 
                    return ${methodName}${paramsList[0]}; 
                }`))(this._context, e);
            }
        }
        catch (_a) {
            Exception.callMethodError();
        }
    }
    matchValue(text) {
        text = Utils.deleteBlank(text);
        const reg = /\{\{(.*?)\}\}/g;
        const matches = text.match(reg);
        const allPart = text.split(reg);
        let i = 0;
        const result = [];
        allPart.forEach((part) => {
            if (matches && matches[i] === '')
                i++;
            if (matches && matches.length > i && matches[i].indexOf(`{{${part}}}`) > -1) {
                if (part != '') {
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
    moveNodeToFragment(node) {
        if (!node.childNodes)
            return;
        let fragment = document.createDocumentFragment();
        while (node.childNodes.length != 0) {
            fragment.appendChild(node.childNodes[0]);
        }
        return fragment;
    }
}
class Command {
    constructor() { }
    static vBind(node, attr, scoped) {
        const reg = /^(v-bind)*:/;
        let part = attr.name.split(reg);
        const attrName = part[part.length - 1];
        new Watcher(scoped, attr.value, function (newValue) {
            try {
                node.setAttribute(attrName, newValue);
            }
            catch (_a) {
                Exception.attributeBindingError();
            }
        });
    }
    static vText(node, scoped, value) {
        new Watcher(scoped, value, function (newValue) {
            node.innerText = newValue;
        });
    }
    static vHtml(node, scoped, value) {
        new Watcher(scoped, value, function (newValue) {
            node.innerHTML = newValue;
        });
    }
    static vModel(node, scoped, value) {
        const cb = new Function(`value,scoped`, `with(scoped){${value} = value;}`);
        new Watcher(scoped, value, function (newValue) {
            node.value = newValue;
        });
        node.addEventListener('input', (e) => {
            cb(e.target.value, scoped);
        });
    }
    static vLazy(node, scoped, value) {
        const cb = new Function(`value,scoped`, `with(scoped){${value} = value;}`);
        new Watcher(scoped, value, function (newValue) {
            node.value = newValue;
        });
        node.addEventListener('keypress', (e) => {
            if (e.keyCode == "13") {
                cb(e.target.value, scoped);
            }
        });
        node.addEventListener('blur', (e) => {
            cb(e.target.value, scoped);
        });
    }
}
