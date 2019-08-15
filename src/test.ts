import {DecoratorFactoryBuilder} from '../lib/decorator-factory/decorator-factory-builder';
import {DecoratorUtil} from "../lib/decorator-util";

const Demo = DecoratorFactoryBuilder.create()
    .method().class().parameter().build();

@Demo()
class Test2 {

    constructor(public a: string, public b: number) {}
    @Demo()
    public static testStatic(a: string) {
    }
    @Demo()
    public test(b: string): Date {
        return new Date();
    }
}

console.log(DecoratorUtil.getMethods(Test2));
// I need to get a type that determines whether generics are consistent
// Test<A, A>     return number type
// Test<A, >     return number string

type Test<A, B> = A extends B ? number : string;

let a: Test<string, string>; // number type
let b: Test<void, string>; // string type

type Test3<A, B> = A extends B
    ? B extends A
        ? number
        : string
    : string;
let c: Test3<void, object>; // string type
let d: Test3<object, object>; // number type
