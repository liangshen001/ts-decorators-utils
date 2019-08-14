import {DecoratorFactoryBuilder} from '../lib/decorator-factory/decorator-factory-builder';
import {DecoratorUtil} from "../lib/decorator-util";

const Demo = DecoratorFactoryBuilder.create()
    .method().class().parameter().build();

@Demo()
class Test {

    constructor(public a: string, public b: number) {}
    @Demo()
    public static testStatic(a: string) {
    }
    @Demo()
    public test(b: string): Date {
        return new Date();
    }
}

console.log(DecoratorUtil.getMethods(Test));
