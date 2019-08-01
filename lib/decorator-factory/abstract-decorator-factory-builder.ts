import {MetadataKey} from '../bean/metadata-key';
import {ParameterHandler} from '../bean/parameter-handler';
import {PropertyHandler} from '../bean/property-handler';
import {ClassHandler} from '../bean/class-handler';
import {MethodHandler} from '../bean/method-handler';

abstract class AbstractDecoratorFactoryBuilder<V, D> {

    constructor(public metadataKey?: MetadataKey<V>) {}

    public abstract parameter<OPA>(
        parameterHandler: ParameterHandler<V, OPA>,
        metadataKey?: string | symbol
    ): AbstractDecoratorFactoryBuilder<V, any>;

    public abstract property<OP>(
        propertyHandler: PropertyHandler<V, OP>,
        metadataKey?: string | symbol
    ): AbstractDecoratorFactoryBuilder<V, any>;

    public abstract method<OM>(
        methodHandler: MethodHandler<V, OM>,
        metadataKey?: string | symbol
    ): AbstractDecoratorFactoryBuilder<V, any>;

    public abstract class<OC>(
        classHandler: ClassHandler<V, OC>,
        metadataKey?: string | symbol
    ): AbstractDecoratorFactoryBuilder<V, any>;

    protected abstract build(): D;
}


export {AbstractDecoratorFactoryBuilder};

