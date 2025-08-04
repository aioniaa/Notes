/**
 * Demo函数会在Person类定义时执行
 * 参数说明：
 *  target参数时被装饰的类，即：Person
 */

function CustomString(target: Function) {
    target.prototype.toString = function() {
        // this为target这个类的实例对象
        return JSON.stringify(this)
    }
    // 对指定对象进行封锁
    Object.seal(target.prototype);  // 对此进行封锁后，这个target对象身上的属性不能够随便的增加/删除
    // 添加上之后如果在对其修改则会出现以下错误：
    // Uncaught TypeError: can't define property "x": Object is not extensible
}


@CustomString   // 此处target --> Person
class Person {
    name: string;
    age: number;

    constructor(name: string, age: number) {
        this.name = name;
        this.age = age;
    }
}


const p1 = new Person("zhangsan", 18);

console.log(p1.toString());

// interface Person {
//     x: number;
// }
// 找到Person，摸到他的原型对象进行添加一个x属性
// Person.prototype.x = 99
// console.log(p1.x);  // 99
