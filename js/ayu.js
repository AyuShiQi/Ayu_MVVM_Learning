/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/Ayu/ayu-compiler.ts":
/*!*********************************!*\
  !*** ./src/Ayu/ayu-compiler.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ Compiler)\n/* harmony export */ });\n/* harmony import */ var _ayu_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ayu-utils */ \"./src/Ayu/ayu-utils.ts\");\n/* harmony import */ var _ayu_watcher__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ayu-watcher */ \"./src/Ayu/ayu-watcher.ts\");\n/* harmony import */ var _ayu_exception__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ayu-exception */ \"./src/Ayu/ayu-exception.ts\");\n\r\n\r\n\r\nclass Compiler {\r\n    constructor(ayu) {\r\n        this.ensureRoot(ayu.$el);\r\n        this._context = ayu;\r\n        this._el = ayu.$el;\r\n        this._fragment = this.moveNodeToFragment(this._el);\r\n        this.compile(this._fragment);\r\n        this._el.appendChild(this._fragment);\r\n    }\r\n    ensureRoot(el) {\r\n        if (el === document.body || el === document.documentElement) {\r\n            _ayu_exception__WEBPACK_IMPORTED_MODULE_2__[\"default\"].elBindingError();\r\n        }\r\n    }\r\n    compile(template) {\r\n        if (!template.childNodes)\r\n            return;\r\n        template.childNodes.forEach((childNode) => {\r\n            if (childNode.nodeType === 3) {\r\n                this.compileText(childNode);\r\n            }\r\n            if (childNode.nodeType === 1) {\r\n                this.compileElement(childNode);\r\n            }\r\n        });\r\n    }\r\n    compileText(node) {\r\n        const exp = this.matchValue(node.textContent.trim());\r\n        new _ayu_watcher__WEBPACK_IMPORTED_MODULE_1__[\"default\"](this._context, exp, function (newContext) {\r\n            node.textContent = newContext;\r\n        });\r\n    }\r\n    compileElement(node) {\r\n        for (const attr of node.attributes) {\r\n            this.mathchCommand(node, attr);\r\n            this.matchEvent(node, attr);\r\n        }\r\n        this.compile(node);\r\n    }\r\n    mathchCommand(node, attr) {\r\n        if (this.isBinding(attr.name)) {\r\n            Command.vBind(node, attr, this._context);\r\n        }\r\n        else {\r\n            switch (attr.name) {\r\n                case 'v-text':\r\n                    Command.vText(node, this._context, attr.value);\r\n                    break;\r\n                case 'v-html':\r\n                    Command.vHtml(node, this._context, attr.value);\r\n                    break;\r\n                case 'v-model':\r\n                    Command.vModel(node, this._context, attr.value);\r\n                    break;\r\n                case 'v-lazy':\r\n                    Command.vLazy(node, this._context, attr.value);\r\n                    break;\r\n            }\r\n        }\r\n    }\r\n    isBinding(name) {\r\n        const reg = /^(v-bind)*:/;\r\n        return reg.test(name);\r\n    }\r\n    matchEvent(node, attr) {\r\n        switch (attr.name) {\r\n            case '@click':\r\n                node.addEventListener('click', (e) => {\r\n                    this.triggerMethod(attr.value, e);\r\n                });\r\n                break;\r\n            case '@mouseover':\r\n                node.addEventListener('mouseover', (e) => {\r\n                    this.triggerMethod(attr.value, e);\r\n                });\r\n                break;\r\n            case '@mouseout':\r\n                node.addEventListener('mouseout', (e) => {\r\n                    this.triggerMethod(attr.value, e);\r\n                });\r\n                break;\r\n            case '@mousemove':\r\n                node.addEventListener('mousemove', (e) => {\r\n                    this.triggerMethod(attr.value, e);\r\n                });\r\n                break;\r\n            case '@keypress':\r\n                node.addEventListener('keypress', (e) => {\r\n                    this.triggerMethod(attr.value, e);\r\n                });\r\n        }\r\n    }\r\n    triggerMethod(exp, e) {\r\n        const reg = /\\(.*?\\)$/;\r\n        const paramsList = exp.match(reg);\r\n        const methodName = (exp.trim().split(reg))[0];\r\n        if (!methodName) {\r\n            _ayu_exception__WEBPACK_IMPORTED_MODULE_2__[\"default\"].nullMethodWarning();\r\n            return;\r\n        }\r\n        try {\r\n            if (!paramsList) {\r\n                (new Function(`scoped,e`, `with(scoped){\r\n                    return ${methodName}(e);\r\n                }`))(this._context, e);\r\n            }\r\n            else if (paramsList[0].includes('()')) {\r\n                (new Function(`scoped,e`, `with(scoped){\r\n                    return ${methodName}();\r\n                }`))(this._context);\r\n            }\r\n            else {\r\n                (new Function(`scoped,e`, `with(scoped){ \r\n                    return ${methodName}${paramsList[0]}; \r\n                }`))(this._context, e);\r\n            }\r\n        }\r\n        catch (_a) {\r\n            _ayu_exception__WEBPACK_IMPORTED_MODULE_2__[\"default\"].callMethodError();\r\n        }\r\n    }\r\n    matchValue(text) {\r\n        text = _ayu_utils__WEBPACK_IMPORTED_MODULE_0__[\"default\"].deleteBlank(text);\r\n        const reg = /\\{\\{(.*?)\\}\\}/g;\r\n        const matches = text.match(reg);\r\n        const allPart = text.split(reg);\r\n        let i = 0;\r\n        const result = [];\r\n        allPart.forEach((part) => {\r\n            if (matches && matches[i] === '')\r\n                i++;\r\n            if (matches && matches.length > i && matches[i].indexOf(`{{${part}}}`) > -1) {\r\n                if (part != '') {\r\n                    result.push(`(${part})`);\r\n                }\r\n                else {\r\n                    _ayu_exception__WEBPACK_IMPORTED_MODULE_2__[\"default\"].nullInterpolationWarning();\r\n                }\r\n                i++;\r\n            }\r\n            else {\r\n                result.push(`\"${part}\"`);\r\n            }\r\n        });\r\n        return result.join(`+`);\r\n    }\r\n    moveNodeToFragment(node) {\r\n        if (!node.childNodes)\r\n            return;\r\n        let fragment = document.createDocumentFragment();\r\n        while (node.childNodes.length != 0) {\r\n            fragment.appendChild(node.childNodes[0]);\r\n        }\r\n        return fragment;\r\n    }\r\n}\r\nclass Command {\r\n    constructor() { }\r\n    static vBind(node, attr, scoped) {\r\n        const reg = /^(v-bind)*:/;\r\n        let part = attr.name.split(reg);\r\n        const attrName = part[part.length - 1];\r\n        new _ayu_watcher__WEBPACK_IMPORTED_MODULE_1__[\"default\"](scoped, attr.value, function (newValue) {\r\n            try {\r\n                node.setAttribute(attrName, newValue);\r\n            }\r\n            catch (_a) {\r\n                _ayu_exception__WEBPACK_IMPORTED_MODULE_2__[\"default\"].attributeBindingError();\r\n            }\r\n        });\r\n    }\r\n    static vText(node, scoped, value) {\r\n        new _ayu_watcher__WEBPACK_IMPORTED_MODULE_1__[\"default\"](scoped, value, function (newValue) {\r\n            node.innerText = newValue;\r\n        });\r\n    }\r\n    static vHtml(node, scoped, value) {\r\n        new _ayu_watcher__WEBPACK_IMPORTED_MODULE_1__[\"default\"](scoped, value, function (newValue) {\r\n            node.innerHTML = newValue;\r\n        });\r\n    }\r\n    static vModel(node, scoped, value) {\r\n        const cb = new Function(`value,scoped`, `with(scoped){${value} = value;}`);\r\n        new _ayu_watcher__WEBPACK_IMPORTED_MODULE_1__[\"default\"](scoped, value, function (newValue) {\r\n            node.value = newValue;\r\n        });\r\n        node.addEventListener('input', (e) => {\r\n            cb(e.target.value, scoped);\r\n        });\r\n    }\r\n    static vLazy(node, scoped, value) {\r\n        const cb = new Function(`value,scoped`, `with(scoped){${value} = value;}`);\r\n        new _ayu_watcher__WEBPACK_IMPORTED_MODULE_1__[\"default\"](scoped, value, function (newValue) {\r\n            node.value = newValue;\r\n        });\r\n        node.addEventListener('keypress', (e) => {\r\n            if (e.keyCode == \"13\") {\r\n                cb(e.target.value, scoped);\r\n            }\r\n        });\r\n        node.addEventListener('blur', (e) => {\r\n            cb(e.target.value, scoped);\r\n        });\r\n    }\r\n}\r\n\n\n//# sourceURL=webpack://endinghomework/./src/Ayu/ayu-compiler.ts?");

/***/ }),

/***/ "./src/Ayu/ayu-dep.ts":
/*!****************************!*\
  !*** ./src/Ayu/ayu-dep.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ Dep)\n/* harmony export */ });\nclass Dep {\r\n    constructor() {\r\n        this.subs = new Map();\r\n    }\r\n    add(target) {\r\n        this.subs.set(target.id, target);\r\n    }\r\n    notify() {\r\n        for (const sub of this.subs.values()) {\r\n            sub.update();\r\n        }\r\n    }\r\n}\r\n\n\n//# sourceURL=webpack://endinghomework/./src/Ayu/ayu-dep.ts?");

/***/ }),

/***/ "./src/Ayu/ayu-exception.ts":
/*!**********************************!*\
  !*** ./src/Ayu/ayu-exception.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ Exception)\n/* harmony export */ });\nclass Exception {\r\n    constructor() { }\r\n    static nullInterpolationWarning() {\r\n        console.warn('[from Ayu]: 插值模板中内容为空，请确保没有漏写！');\r\n    }\r\n    static nullMethodWarning() {\r\n        console.warn('[from Ayu]: 你没有绑定触发事件调用函数！');\r\n    }\r\n    static dataTypeError() {\r\n        console.error('[from Ayu]：警告！传入的data应该为一个对象');\r\n    }\r\n    static syntaxError() {\r\n        console.error('[from Ayu]: 语法出现错误');\r\n        console.warn('请检查模板语法是否正确，引用变量是否存在？');\r\n        console.warn('如若使用v-text时,请确保插入字符串中没有英文\\\"\\\"或者英文\\'\\'');\r\n    }\r\n    static callMethodError() {\r\n        console.error('[from Ayu]: 在@click等事件触发指令中，只能调用函数，不能直接写入代码！！如果你需要进行一些操作，请将相应语法封装入函数中进行调用。');\r\n        console.error('[from Ayu]: 函数调用失败，请您检查函数名及参数是否传入正确！');\r\n    }\r\n    static attributeBindingError() {\r\n        console.error('[from Ayu]: v-bind指令绑定属性失败，请检查绑定语法是否正确，属性格式是否正确');\r\n    }\r\n    static nullElError() {\r\n        console.error('[from Ayu]: 你没有传入el配置参数');\r\n    }\r\n    static elBindingNullError() {\r\n        console.error('[from Ayu]: el绑定失败，请确保你传入的el配置参数是正确的！');\r\n    }\r\n    static elBindingError() {\r\n        console.error('[from Ayu]: 请不要将根节点设置在<html>或<body>标签上，否则会出现错误！');\r\n    }\r\n}\r\n\n\n//# sourceURL=webpack://endinghomework/./src/Ayu/ayu-exception.ts?");

/***/ }),

/***/ "./src/Ayu/ayu-observer.ts":
/*!*********************************!*\
  !*** ./src/Ayu/ayu-observer.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ Observer)\n/* harmony export */ });\n/* harmony import */ var _ayu_dep__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ayu-dep */ \"./src/Ayu/ayu-dep.ts\");\n/* harmony import */ var _ayu_exception__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ayu-exception */ \"./src/Ayu/ayu-exception.ts\");\n\r\n\r\nclass Observer {\r\n    constructor(data) {\r\n        this.ensureData(data);\r\n        this.deepObserve(data);\r\n    }\r\n    ensureData(data) {\r\n        if (typeof data != 'object') {\r\n            _ayu_exception__WEBPACK_IMPORTED_MODULE_1__[\"default\"].dataTypeError();\r\n        }\r\n    }\r\n    deepObserve(target) {\r\n        for (const key in target) {\r\n            this.reactiveBinding(target, key, target[key]);\r\n            if (typeof target[key] === 'object' && target[key]) {\r\n                this.deepObserve(target[key]);\r\n            }\r\n        }\r\n    }\r\n    reactiveBinding(obj, key, value) {\r\n        const dep = new _ayu_dep__WEBPACK_IMPORTED_MODULE_0__[\"default\"]();\r\n        Object.defineProperty(obj, key, {\r\n            configurable: false,\r\n            get: () => {\r\n                if (_ayu_dep__WEBPACK_IMPORTED_MODULE_0__[\"default\"].target)\r\n                    dep.add(_ayu_dep__WEBPACK_IMPORTED_MODULE_0__[\"default\"].target);\r\n                return value;\r\n            },\r\n            set: (newValue) => {\r\n                value = newValue;\r\n                dep.notify();\r\n            }\r\n        });\r\n    }\r\n}\r\n\n\n//# sourceURL=webpack://endinghomework/./src/Ayu/ayu-observer.ts?");

/***/ }),

/***/ "./src/Ayu/ayu-utils.ts":
/*!******************************!*\
  !*** ./src/Ayu/ayu-utils.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ Utils)\n/* harmony export */ });\nclass Utils {\r\n    constructor() { }\r\n    static deleteBlank(str) {\r\n        const regBlank = /[\\n\\r]/g;\r\n        const parts = str.split(regBlank);\r\n        return parts.reduce((prev, attr) => {\r\n            return prev + attr;\r\n        });\r\n    }\r\n}\r\n\n\n//# sourceURL=webpack://endinghomework/./src/Ayu/ayu-utils.ts?");

/***/ }),

/***/ "./src/Ayu/ayu-watcher.ts":
/*!********************************!*\
  !*** ./src/Ayu/ayu-watcher.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ Watcher)\n/* harmony export */ });\n/* harmony import */ var _ayu_dep__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ayu-dep */ \"./src/Ayu/ayu-dep.ts\");\n/* harmony import */ var _ayu_exception__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ayu-exception */ \"./src/Ayu/ayu-exception.ts\");\n\r\n\r\nclass Watcher {\r\n    constructor(scoped, exp, cb) {\r\n        this.scoped = scoped;\r\n        this.exp = exp;\r\n        this.id = Watcher.count++;\r\n        this.cb = cb;\r\n        this.update();\r\n    }\r\n    get() {\r\n        _ayu_dep__WEBPACK_IMPORTED_MODULE_0__[\"default\"].target = this;\r\n        const newValue = this.calculateExp();\r\n        _ayu_dep__WEBPACK_IMPORTED_MODULE_0__[\"default\"].target = null;\r\n        return newValue;\r\n    }\r\n    update() {\r\n        this.cb(this.get());\r\n    }\r\n    calculateExp() {\r\n        try {\r\n            const fn = new Function(`scoped`, `with(scoped){return ${this.exp};}`);\r\n            return fn(this.scoped);\r\n        }\r\n        catch (e) {\r\n            _ayu_exception__WEBPACK_IMPORTED_MODULE_1__[\"default\"].syntaxError();\r\n        }\r\n        return '';\r\n    }\r\n}\r\nWatcher.count = 0;\r\n\n\n//# sourceURL=webpack://endinghomework/./src/Ayu/ayu-watcher.ts?");

/***/ }),

/***/ "./src/Ayu/ayu.ts":
/*!************************!*\
  !*** ./src/Ayu/ayu.ts ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _ayu_observer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ayu-observer */ \"./src/Ayu/ayu-observer.ts\");\n/* harmony import */ var _ayu_compiler__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ayu-compiler */ \"./src/Ayu/ayu-compiler.ts\");\n/* harmony import */ var _ayu_exception__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ayu-exception */ \"./src/Ayu/ayu-exception.ts\");\nvar _a;\r\n\r\n\r\n\r\nconst ayu = (_a = class Ayu {\r\n        constructor(config) {\r\n            this.$id = ++Ayu.id;\r\n            Ayu.ayus.set(this.$id, this);\r\n            this.binding(config);\r\n            this.proxy();\r\n            new _ayu_observer__WEBPACK_IMPORTED_MODULE_0__[\"default\"](this.$data);\r\n            config.created && config.created();\r\n            new _ayu_compiler__WEBPACK_IMPORTED_MODULE_1__[\"default\"](this);\r\n            config.mounted && config.mounted();\r\n        }\r\n        static get(id) {\r\n            return Ayu.ayus.get(id);\r\n        }\r\n        static has(id) {\r\n            return Ayu.ayus.has(id);\r\n        }\r\n        binding(config) {\r\n            var _a, _b;\r\n            this.bindEL(config);\r\n            Object.defineProperty(this, '$data', {\r\n                configurable: false,\r\n                writable: false,\r\n                value: (_a = config.data) !== null && _a !== void 0 ? _a : {}\r\n            });\r\n            this.$methods = (_b = config.methods) !== null && _b !== void 0 ? _b : {};\r\n        }\r\n        bindEL(config) {\r\n            if (!config.el) {\r\n                _ayu_exception__WEBPACK_IMPORTED_MODULE_2__[\"default\"].nullElError();\r\n            }\r\n            if (!document.querySelector(config.el)) {\r\n                _ayu_exception__WEBPACK_IMPORTED_MODULE_2__[\"default\"].elBindingNullError();\r\n            }\r\n            this.$el = document.querySelector(config.el);\r\n        }\r\n        proxy() {\r\n            this.datasProxy(this, this.$data);\r\n            this.methodsProxy(this, this.$methods);\r\n        }\r\n        datasProxy(target, data) {\r\n            for (const key in data) {\r\n                Object.defineProperty(target, key, {\r\n                    configurable: false,\r\n                    get: () => {\r\n                        return data[key];\r\n                    },\r\n                    set: (newValue) => {\r\n                        data[key] = newValue;\r\n                    }\r\n                });\r\n            }\r\n        }\r\n        methodsProxy(target, methods) {\r\n            for (const key in methods) {\r\n                target[key] = methods[key];\r\n            }\r\n        }\r\n    },\r\n    _a.id = 0,\r\n    _a.ayus = new Map(),\r\n    _a);\r\nObject.defineProperty(window, 'Ayu', {\r\n    value: ayu\r\n});\r\n\n\n//# sourceURL=webpack://endinghomework/./src/Ayu/ayu.ts?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/Ayu/ayu.ts");
/******/ 	
/******/ })()
;