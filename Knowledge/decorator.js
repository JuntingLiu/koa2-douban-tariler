/**
 * decorator 装饰器
 * 通过装饰器可以拿到目标类，同时对他增加一些额外的属性或方法，甚至去修改它内部的描述。
 */
class Boy {
    @speak('中文')
    run () {
        console.log('I can speak ' + this.language);
        console.log('I can run!');
    }
}
/**
 * 
 * @param {object} target  目标类所装饰的对象 -> Boy
 * @param {*} key 所修饰的方法 -> run
 * @param {*} descriptor 配置描述，它可以对应到Object.defineProperties(); 是否可配置、是否可枚举、可写
 */
// 多传一个参数
function speak (language) {
    return function (target, key, descriptor) {
        console.log(target);
        console.log(key);
        console.log(descriptor);

        target.language = language;

        return descriptor;
    }
}

const junting = new Boy();

junting.run();

