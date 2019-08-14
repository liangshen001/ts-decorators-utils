# ts-decorators-utils

### What is it ?

Create the typescript decorator declaratively, Just like Java.

It also provides tools to implement 'reflection'

It can run on the web or in nodejs

### Getting Start

#### install

```
npm i ts-decorator-utils
```

#### tsconfig.json

```json5
{
  "compilerOptions": {
    "outDir": "./dist",
    "module": "commonjs",
    "target": "es6",
    "declaration": true,
    "lib": [
      "es6",
      "dom",
      "esnext"
    ],
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "strictNullChecks": true
  },
  "exclude": [
    "node_modules",
    "dist"
  ]
}
```

*Notice 'experimentalDecorators' and 'emitDecoratorMetadata'*

#### Create a decorator

Create the required location, parameters, and metadata

```typescript
import {DecoratorFactoryBuilder} from 'ts-decorators-utils';
const Demo = DecoratorFactoryBuilder.create()
    .class().method().property().parameter().build();




type Demo2MetadataValue = {
    value: string | number;
}

type Demo2PropOption = {
    value: string;
} | string | void;

type Demo2ParamOption = {
    value1: number;
    value2: number;
};
const Demo2 = DecoratorFactoryBuilder.create<Demo2MetadataValue>()
    .property<Demo2PropOption>(option => typeof option === 'string' ? )
    .parameter<Demo2ParamOption>()
    .build();
```

#### Use decorators

```typescript
@Demo()
class TestClass {
    @Demo2('demo2PropTest')
    @Demo()
    public prop: string;
    @Demo()
    public staticProp: string;

    constructor(num: number) {}
    
    @Demo()
    public method(@Demo() param: string) {}
    
    @Demo()
    public static staticMethod(): string {
        return '';
    }
}
```

#### Getting information is similar to Java reflection


```typescript
import {DecoratorUtil} from 'ts-decorators-utils';

// Is there a specified decorator on the target on the class， Some will return true or Object, and none will return undefined
console.log(DecoratorUtil.getMetadata(Demo, TestClass)); // true
console.log(DecoratorUtil.getMetadata(Demo, TestClass, 'staticMethod')); // true
console.log(DecoratorUtil.getMetadata(Demo, TestClass, 'staticProp')); // true
console.log(DecoratorUtil.getMetadata(Demo, TestClass.prototype, 'prop')); // true
console.log(DecoratorUtil.getMetadata(Demo, TestClass.prototype, 'method')); // true

console.log(DecoratorUtil.getMetadata(Demo, TestClass.prototype)); // undefined
console.log(DecoratorUtil.getMetadata(Demo, TestClass, 'staticMethod2')); // undefined

console.log(DecoratorUtil.getMethods(TestClass)); // [ [ 'staticMethod', [ [Function: String] ], undefined ] ]
```



### Demo1

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
