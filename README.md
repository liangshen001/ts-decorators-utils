# typescript中装饰器声明


```typescript
import {DecoratorFactoryBuilder, DecoratorUtil} from 'ts-decorators-utils';

const Value = DecoratorFactoryBuilder.create()
    .property().parameter().build();


class Demo {
    @Value()
    public a: string;

    public test(@Value() b: string) {
    }
}

console.log(DecoratorUtil.getMetadata(Value, Demo.prototype, 'a')); // true
console.log(DecoratorUtil.getMetadata(Value, Demo.prototype, 'test')); // undefined
console.log(DecoratorUtil.getMetadata(Value, Demo.prototype, 'test', 0)); // true

let metadataKey = Value.metadataKey; // is a Symbol Type
```

```typescript
import {DecoratorFactoryBuilder, DecoratorUtil} from 'ts-decorators-utils';

const Value2 = DecoratorFactoryBuilder.create<string>()
    .method<string>().class<string>().build();

@Value2('demo2')
class Demo2 {

    @Value2('testStatic')
    public static testStatic(a: number): void {
    }

    constructor(public a: string, public b: number) {}

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
```
