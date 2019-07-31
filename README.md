# typescript中装饰器声明


## 使用Reflect的metadata

主要方法

DecoratorFactoryBuilder.create<ValueMetadataValue>(valueMetadataKey)

```typescript
import {DecoratorFactoryBuilder} from 'ts-decorators-utils'


const valueMetadataKey = Symbol('Value');

type ValueMetadataValue = {
    a: string;
}


type ValueClassOption = {
    a: string;
} | string | void;

type ValueMethodOption = {
    b: string;
}

const Value = DecoratorFactoryBuilder.create<ValueMetadataValue>(valueMetadataKey)
    .class<ValueClassOption>((option, target) => {
        let a = '';
        if (option) {
            a = typeof option === 'string' ? option : option.a;
        }
        return {a};
    }).method<ValueMethodOption>((option, target, propertyKey, descriptor) => {
        return {
            a: option.b
        }
    }).property((option, target, propertyKey) => {
        // option is undefined 
        // do something...
        return {
            a: 'propertyTest'
        }
    }).build();

@Value()
class A {}

@Value('b')
class B {}

@Value({a: 'b'})
class B {
    
    @Value({b: 'methodTest'})
    public test() {}
}

const aMetadataValue: ValueMetadataValue = Reflect.getMetadata(valueMetadataKey, A);// {a: ''}
const bMetadataValue: ValueMetadataValue = Reflect.getMetadata(valueMetadataKey, B);// {a: 'b'}

const bMethodMetadataValue: ValueMetadataValue = Reflect.getMetadata(valueMetadataKey, B, 'test');// {a: 'methodTest'}
const bPropertyMetadataValue: ValueMetadataValue = Reflect.getMetadata(valueMetadataKey, B, 'a');// {a: 'propertyTest'}
```


## 不使用Reflect metadata

直接
DecoratorFactoryBuilder.create()
来创建builder 其他都一样  不过得到目标的原数据需要在回调中自定义

```typescript
import {DecoratorFactoryBuilder} from 'ts-decorators-utils'

type ValueClassOption = {
    a: string;
} | string | void;

const Value = DecoratorFactoryBuilder.create()
    .class<ValueClassOption>(((option, target) => {
        // 对option 和target进行一些 保存或处理, 内部将不会使用relect metadata来做保存处理
    })).build();

@Value()
class A {}

@Value('b')
class B {}

@Value({a: 'b'})
class B {

}
```
