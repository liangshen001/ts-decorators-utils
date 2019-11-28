import {DecoratorFactoryBuilder} from '../lib/decorator-factory/decorator-factory-builder';
import {DecoratorUtil} from "../lib/decorator-util";

// let Demo: () => (ParameterDecorator & MethodDecorator & ClassDecorator) = () => <any> null;
let Demo = DecoratorFactoryBuilder.create()
    .class().parameter().method().property().build();

let Demo1: () => ParameterDecorator = () => {
    return (target: Object, propertyKey: string | symbol, parameterIndex: number) => {
        console.log(target);
        console.log(propertyKey);
        console.log(parameterIndex);
    }
}

let Demo2: () => PropertyDecorator = () => {
    return (target: Object, propertyKey: string | symbol) => {
        console.log(target);
        console.log(propertyKey);
    }
}

@Demo()
class Test2 {
    @Demo2()
    bb: string;
    constructor(public a: string, public b: number) {}
    @Demo()
    public static testStatic(a: string): string {
        return '';
    }
    @Demo()
    public test(@Demo1() b: string): Date {
        return new Date();
    }
}

let metadata = DecoratorUtil.getMetadata(Demo, Test2.prototype, 'test');
console.log(metadata);
//
//
let methods = DecoratorUtil.getMethods(Test2.prototype);
// console.log(methods);

// console.log(DecoratorUtil.getMethods(Test2));
// // I need to get a type that determines whether generics are consistent
// // Test<A, A>     return number type
// // Test<A, >     return number string
//
// type Test<A, B> = A extends B ? number : string;
//
// let a: Test<{}, {a: ''}>; // number type
// let b: Test<void, string>; // string type
//
// type Test3<A, B> = A extends B
//     ? (B extends A
//         ? string
//         : number)
//     : string;
// let c: Test3<any, object>; // string type
// let d: Test3<string, number>; // number type
