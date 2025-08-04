/**
 * Demo函数会在Person类定义时执行
 * 参数说明：
 *  target参数时被装饰的类，即：Person
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
function CustomString(target) {
    target.prototype.toString = function () {
        // this为target这个类的实例对象
        return JSON.stringify(this);
    };
    // 对指定对象进行封锁
    Object.seal(target.prototype); // 对此进行封锁后，这个target对象身上的属性不能够随便的增加/删除
    // 添加上之后如果在对其修改则会出现以下错误：
    // Uncaught TypeError: can't define property "x": Object is not extensible
}
let Person = class Person {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
};
Person = __decorate([
    CustomString // 此处target --> Person
    ,
    __metadata("design:paramtypes", [String, Number])
], Person);
const p1 = new Person("zhangsan", 18);
console.log(p1.toString());
export {};
// interface Person {
//     x: number;
// }
// 找到Person，摸到他的原型对象进行添加一个x属性
// Person.prototype.x = 99
// console.log(p1.x);  // 99
//# sourceMappingURL=index.js.map