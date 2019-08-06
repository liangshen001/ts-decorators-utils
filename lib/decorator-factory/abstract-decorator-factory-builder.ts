import {ParameterHandler} from '../bean/parameter-handler';
import {PropertyHandler} from '../bean/property-handler';
import {ClassHandler} from '../bean/class-handler';
import {MethodHandler} from '../bean/method-handler';
import {MetadataDecoratorFactory} from "../bean/metadata-decorator-factory";

abstract class AbstractDecoratorFactoryBuilder<V, D> {

    constructor(public metadataKey?: string | symbol) {}

    public abstract parameter<OPA>(
        parameterHandler: ParameterHandler<V, OPA>
    ): AbstractDecoratorFactoryBuilder<V, any>;

    public abstract property<OP>(
        propertyHandler: PropertyHandler<V, OP>
    ): AbstractDecoratorFactoryBuilder<V, any>;

    public abstract method<OM>(
        methodHandler: MethodHandler<V, OM>
    ): AbstractDecoratorFactoryBuilder<V, any>;

    public abstract class<OC>(
        classHandler: ClassHandler<V, OC>
    ): AbstractDecoratorFactoryBuilder<V, any>;

    protected abstract build(): MetadataDecoratorFactory<D, V>;
}


export {AbstractDecoratorFactoryBuilder};

