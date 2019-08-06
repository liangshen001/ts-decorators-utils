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
console.log(DecoratorUtil.getMetadata(Value, Demo.prototype, 'test')); // false
console.log(DecoratorUtil.getMetadata(Value, Demo.prototype, 'test', 0)); // true

let metadataKey = Value.metadataKey; // is a Symbol Type
```

```typescript
import {DecoratorFactoryBuilder, DecoratorUtil} from 'ts-decorators-utils';

const Value2 = DecoratorFactoryBuilder.create()
    .method<number>((option, target, propertyKey, descriptor, paramTypes, returnType) => {
        console.log(option);
        console.log(propertyKey);
        console.log(paramTypes);
        console.log(returnType);
    }).class<string>().build();

@Value2('demo2')
class Demo2 {
    constructor(public a: string, public b: number) {}

    @Value2(123)
    public test(b: string): Date {
        return new Date();
    }
}

console.log(DecoratorUtil.getMetadata(Value2, Demo2.prototype, 'test')); // 123
```
