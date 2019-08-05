import {DecoratorFactoryBuilder} from './decorator-factory/decorator-factory-builder';
import {MetadataKey} from './bean/metadata-key';
import {Constructor} from './bean/constructor';

type D = {
    a: string;
    b: number;
}

type C = {
    a: string;
}


const Value = DecoratorFactoryBuilder.create()
    .property<void>((option, target, propertyKey, type) => {
    }).method<C>((<T>(option, target, propertyKey, descriptor, paramTypes, returnType) => {
    })).class<void>(() => {}).parameter<void>(() => {}).build();

type Type<PR, PA> = PR extends PA ? ((p: PR) => PropertyDecorator & ParameterDecorator)
    : ((p: PR) => PropertyDecorator) & ((p: PA) => ParameterDecorator);

let Value1 = (option: D): ClassDecorator & MethodDecorator => () => {};

@Value()
class A {
    @Value()
    public a: string;

    @Value({a: ''})
    public test( a: string): number {
        console.log(22222);
        return 2;
    }
}
type a<OP, OM> = OP extends OM ? (OM extends OP ? string : number) : number;

let b: a<C, D>;
