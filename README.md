## 简介

 参考Vue形式的MVVM简易版框架Ayu	

- 使用typescript进行开发
- 已实现数据代理、数据劫持、消息订阅发布模式、单向绑定与双向绑定
- 支持插值语法、简单内置指令与部分事件处理指令
- 支持created与mounted生命周期函数调用
- 暂未支持组件化开发，持续更新中。。。

#### 设计架构

![](.\images\Snipaste_2022-07-13_21-59-41.png)



#### 技术栈

- javascript 

- typescript

- webpack

  

## 引用方法

#### 1.script标签引入

​	你可以直接在html文件中引入ayu.js进行使用

```html
<script src='path/ayu.js'></script>
```



#### 2.es6模块化开发

​	如果你进行es6模块化方式进行开发，你可以直接下载对应js版本或ts版本框架包进行引入，不支持CommonJs语法

引入方式：

```javascript
import Ayu from 'path/Ayu/ayu.js'   //js开发版本
```

```javascript
import Ayu from 'path/Ayu/ayu.ts'   //ts开发版本
```



## 使用入门

1. ##### 通过调用Ayu构造函数创建Ayu实例，传入配置对象

   以下为全部可配置参数：

   ```javascript
   const vm = new Ayu({
   	el: '#root',
       data: {
          	...
       },
       methods: {
           ...
       },
       created() {
           ...
       },
       mounted() {
           ...
       }
   });
   ```

2. ##### 配置参数 el 

   传入所要关联的容器根节点css选择器字符串，传入字符串形式与`addEventListener`保持一致

   **注意：** 

   ①请保证页面上的根节点唯一，若不唯一，则关联式以页面出现的第一个根节点作为Ayu容器

   ②请保证一个容器只关联一个Ayu实例

   ③不要向实例传入html节点与body节点

   

3. ##### 配置参数 data 

   为一个对象形式，其中为该模型要绑定的数据

   

4. ##### 配置参数 methods

   为对象形式，其中为该模型要绑定的函数
   
   
   
5. ##### 生命周期函数mouted与created

   配置相关的生命周期函数，该函数将会在特定时期被调用

   created：将在数据代理与数据劫持完成后进行调用，你可以在该函数中进行数据方面的操作

   mounted：将在html编译完成后进行调用，你可以在该函数中进行获取DOM结点操作



## 插值语法

​	你可以在容器的任何位置使用`{{ }}`来插入数据或表达式，但不要让它出现在标签属性列表中

-  **{{ }}** 中的所有内容会以代码的形式进行解析，请保证插值模板内的内容是符合代码书写格式的
-  **{{ }}** 内的相关数据及函数会被显现，在相关数据变化时，内容会跟随发生变化(单向绑定)
- 在 **{{ }}** 所有代码作用域均为当前Ayu实例，你可以直接调用Ayu实例里的所有参数和函数
- 但 **{{ }}** 中的`this`指向的是全局对象global，在浏览器中为window，所以不要再调用Ayu实例参数时使用`this`关键字


## 指令语法

​	你可以在标签属性列表中使用以下指令：

| 基本指令 |                  说明                  |              示例              |
| :------: | :------------------------------------: | :----------------------------: |
| v-bind:  |        属性单向绑定，可缩写为:         | v-bind:href="..."或:href="..." |
| v-model  |                双向绑定                |         v-model="..."          |
|  v-lazy  |               双向懒绑定               |          v-lazy="..."          |
|  v-text  | innerText,将=后的表达式值赋给innerText |          v-text="..."          |
|  v-html  | innerHTML,将=后的表达式值赋给innerHTML |          v-html="..."          |

- 关于v-bind，你可以在标签中对任何属性进行绑定操作，属性值中的内容将以表达式的形式进行编译，当相关数据发生改变时，属性值会进行更行

- 关于v-model与v-lazy，同为双向绑定，仅可在input的text框与textarea中使用。

  但v-model按下任何键都会导致数据更新，v-lazy仅在失去焦点与按下回车后才更新数据

- 关于v-html，不要在=号后插入的字符串中出现英文的""或者是‘’，中文的引号与``可以出现

  ```html
  <html>
  	<head>
  		...
  		<script src="ayu.js"></script>
  		...
  	</head>
  		<body>
              <div id="root">
              <a :href="href">点击跳转</a>
              <p>你的姓名是{{'王'+info.name}}</p>
              <input type="text" v-model="info.name">
              <p v-text="info.name+'今年'+info.age+'岁了'"></p>
              </div>
      	<script>
              const vm = new Ayu({
                  el: '#root',
                  data: {
                      href:"https://gitee.com/Everglow_030209/dashboard/projects",
                      info: {
                          name: '小明',
                          age: '3'
                      }
                  },
                  methods: {
                      hello(){
                          console.log('hello Ayu!');
                      }
                  }
              });
      	</script>
  	</body>
  </html>
  ```

  

​	除上述指令，你还可以使用以下事件监听指令：

| 事件监听指令 |       说明       |         示例         |
| :----------: | :--------------: | :------------------: |
|    @click    | 监听鼠标点击事件 |   @click="methods"   |
|  @mouseover  | 监听鼠标经过事件 | @mouseover="methods" |
|  @mouseout   | 监听鼠标移出事件 | @mouseout="methods"  |
|  @mousemove  | 监听鼠标移动事件 | @mousemove="methods" |
|  @keypress   | 监听键盘按下事件 | @keypress="methods"  |

- 当使用响应指令后，当监听到响应事件，则会去调用=号后的函数

- 事件指令后只能调用methods中的函数，暂不支持直接写入代码，如果你需要进行一些数据操作，请将相关代码封装入函数进行调用

  ```html
  <!-- 错误 -->
  <button @click=" name = '小李' ">点击更改姓名</button>
  <!-- 正确 -->
  <button @click="changeName">点击更改姓名</button>
  ...
  <script>
      ...
      data: {
          name: '小华'
      },
      methods:{
          changeName(){
          	name = '小李';
      	}
      }
      ...
  </script>
  ```

  

- 事件指令中，若调用函数没有参数，或者参数仅调用事件对象，可以忽略（）

- 若函数存在参数，你需要显式的使用（）调用。若需要使用事件对象e，请在形参列表中传入e进行调用，e的传入位置不定，你可以自行配置。

- 在事件指令中调用事件对象，必须传入e，不能是其他形式

  如：

  ```html
  <html>
  	<head>
  		...
  		<script src="ayu.js"></script>
  		...
  	</head>
  	<body>
          <div id="root">
              <button @click="hello">点击打招呼</button>
              <button @click="lookE">点击打招呼</button>
              <button @click="miao('花花',e)">点击发出猫叫</button>
              <!-- 错误 -->
              <button @click="miao('花花',$e)">点击发出猫叫02</button>
          </div>
          <script>
              const vm = new Ayu({
                  el: '#root',
                  data: {
                      ...
                  },
                  methods: {
                      hello(){
                          console.log('hello Ayu!');
                      },
                      lookE($e){
                          console.log($e);  //事件对象
                      },
                      miao(name,event){
                          console.log(name+'正在喵喵叫');
                          console.log(event);  //事件对象
                      }
                  }
              });
  		</script>
  	</body>
  </html>
  ```

  

## methods注意

关于methods中的函数

- 你可以直接在插值语法中使用它们，并且在调用的相关数据发生改变时，函数也会被重新调用，进行模板更新
- methods对象中的函数，this指向的是Ayu实例
- 在函数被作为事件函数调用时，才允许你在函数形参列表中出现事件对象e
- 在函数会被作为事件函数调用时，建议不要把它作为普通函数在插值语法中调用

