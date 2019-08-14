import {
    AbstractDecoratorFactoryBuilder
} from './abstract-decorator-factory-builder';
import {ParameterHandler} from '../bean/parameter-handler';
import {PropertyHandler} from '../bean/property-handler';
import {ClassHandler} from '../bean/class-handler';
import {MethodHandler} from '../bean/method-handler';
import {ParameterDecoratorFactoryBuilder} from './parameter/parameter-decorator-factory-builder';
import {MethodDecoratorFactoryBuilder} from './method/method-decorator-factory-builder';
import {ClassDecoratorFactoryBuilder} from './class/class-decorator-factory-builder';
import {PropertyDecoratorFactoryBuilder} from './property/property-decorator-factory-builder';

class DecoratorFactoryBuilder<V> extends AbstractDecoratorFactoryBuilder<V, void> {

    public static create<V = void>(metadataKey?: string | symbol): DecoratorFactoryBuilder<V> {
        return new DecoratorFactoryBuilder<V>(metadataKey || Symbol());
    }

    public parameter<OPA = void>(
        parameterHandler: ParameterHandler<V, OPA>
    ): ParameterDecoratorFactoryBuilder<V, OPA> {
        return new ParameterDecoratorFactoryBuilder<V, OPA>(this.metadataKey, parameterHandler);
    }

    public method<OM = void>(
        methodHandler: MethodHandler<V, OM>
    ): MethodDecoratorFactoryBuilder<V, OM> {
        return new MethodDecoratorFactoryBuilder<V, OM>(this.metadataKey, methodHandler);
    }

    public class<OC = void>(
        classHandler: ClassHandler<V, OC>
    ): ClassDecoratorFactoryBuilder<V, OC> {
        return new ClassDecoratorFactoryBuilder<V, OC>(this.metadataKey, classHandler);
    }
    public property<OP = void>(propertyHandler: PropertyHandler<V, OP>): PropertyDecoratorFactoryBuilder<V, OP> {
        return new PropertyDecoratorFactoryBuilder<V, OP>(this.metadataKey, propertyHandler);
    }

    protected build(): any {
    }
}

export {DecoratorFactoryBuilder};

