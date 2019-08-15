import {DecoratorFactoryBuilder} from "../lib/decorator-factory/decorator-factory-builder";
import {DecoratorUtil} from "../lib/decorator-util";

const Value2 = DecoratorFactoryBuilder.create<string>()
    .method<string>().class<number>().property().build();

@Value2(123)
class Demo2 {

    constructor(public a: string, public b: number) {}
    @Value2('testStatic')
    public static testStatic(a: number): void {
    }


    @Value2('test')
    public test(b: string): Date {
        return new Date();
    }
}

console.log(DecoratorUtil.getMetadata(Value2, Demo2)); // demo2
console.log(DecoratorUtil.getMetadata(Value2, Demo2.prototype, 'test')); // test
console.log(DecoratorUtil.getMetadata(Value2, Demo2, 'testStatic')); // testStatic

// 可以获得类中 使用装饰器的实例方法 集合
console.log(DecoratorUtil.getMethods(Demo2.prototype)); // [ [ 'test', [ [Function: String] ], [Function: Date] ] ]
// 可以获得类中 使用装饰器的实例属性 集合 返回类型  [string, Constructor][]
console.log(DecoratorUtil.getProperties(Demo2.prototype)); // []
// 可以获得类中 使用装饰器的静态属性 集合  返回类型  [string, Constructor[], Constructor][]  数组中元组对应 方法名,方法参数类型数组，方法返回类型
console.log(DecoratorUtil.getMethods(Demo2)); // [ [ 'testStatic', [ [Function: Number] ], undefined ] ]
// 可以获得类中 使用装饰器的静态属性 集合
console.log(DecoratorUtil.getProperties(Demo2)); // []
