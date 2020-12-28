//测试框架 Mocha 实例教程：http://www.ruanyifeng.com/blog/2015/12/a-mocha-tutorial-of-examples.html

function add(x, y) {
  return x + y;
}

module.exports = add;//你把什么东西赋给了module.exports，require后就会得到什么东西

/*
//a.js
module.exports = ['aaa',18] //exports 输出
//b.js
var a= require('a')//require 依赖
console.log(a[1]) //输出18
* */

/*
Module.exports才是真正的接口，exports只不过是它的一个辅助工具。　
最终返回给调用的是Module.exports而不是exports。

所有的exports收集到的属性和方法，都赋值给了Module.exports。
当然，这有个前提，就是Module.exports本身不具备任何属性和方法。
如果，Module.exports已经具备一些属性和方法，那么exports收集来的信息将被忽略。
*/