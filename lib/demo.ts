import {DecoratorFactoryBuilder} from './decorator-factory/decorator-factory-builder';
import {DecoratorUtil} from "./decorator-util";

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

console.log(DecoratorUtil.getMetadata(Value2, Demo2.prototype, 'test'));
