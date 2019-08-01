import {DecoratorFactoryBuilder} from './decorator-factory/decorator-factory-builder';
import {MetadataKey} from './bean/metadata-key';

const Value = DecoratorFactoryBuilder.create()
    .property<number>((option, target, propertyKey, descriptor, type) => {
        if (Object.getPrototypeOf(option) === type.prototype) {
            descriptor.get = () => <any> option;
        } else {
            throw new Error('error')
        }
    }).build();

const Value2 = (value): PropertyDecorator => (...args) => {
    console.log(args);
};


class A {
    @Value(1111)
    public a: string;
}

console.log(new A().a);
