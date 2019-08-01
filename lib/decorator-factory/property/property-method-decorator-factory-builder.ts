import {
    AbstractDecoratorFactoryBuilder,
} from '../abstract-decorator-factory-builder';
import {ParameterHandler} from '../../bean/parameter-handler';
import {PropertyHandler} from '../../bean/property-handler';
import {ClassHandler} from '../../bean/class-handler';
import {MethodHandler} from '../../bean/method-handler';
import {DecoratorUtil} from '../../decorator-util';
import {PropertyDecoratorFactory} from './property-decorator-factory-builder';
import {MethodDecoratorFactory} from '../method/method-decorator-factory-builder';
import {PropertyMethodClassDecoratorFactoryBuilder} from './property-method-class-decorator-factory-builder';
import {ParameterPropertyMethodDecoratorFactoryBuilder} from '../parameter/parameter-property-method-decorator-factory-builder';
import {MetadataKey} from '../../bean/metadata-key';

type PropertyMethodDecoratorFactory<OP, OM> = PropertyDecoratorFactory<OP> & MethodDecoratorFactory<OM>;

class PropertyMethodDecoratorFactoryBuilder<V, OP, OM>
    extends AbstractDecoratorFactoryBuilder<V, PropertyMethodDecoratorFactory<OP, OM>> {

    constructor(
        public metadataKey: MetadataKey<V> | undefined,
        public propertyHandler: PropertyHandler<V, OP>,
        public methodHandler: MethodHandler<V, OM>
    ) {
        super(metadataKey);
    }

    public build(): PropertyMethodDecoratorFactory<OP, OM> {
        return DecoratorUtil.makeParameterAndPropertyAndMethodAndClassDecorator<void, OP, OM, void, V>(
            undefined, this.propertyHandler, this.methodHandler, undefined, this.metadataKey);
    }

    public parameter<OPA = void>(
        parameterHandler: ParameterHandler<V, OPA>
    ): ParameterPropertyMethodDecoratorFactoryBuilder<V, OPA, OP, OM> {
        return new ParameterPropertyMethodDecoratorFactoryBuilder<V, OPA, OP, OM>(
            this.metadataKey, parameterHandler, this.propertyHandler, this.methodHandler
        )
    }

    public method<OM = void>(
        methodHandler: MethodHandler<V, OM>
    ): PropertyMethodDecoratorFactoryBuilder<V, OP, OM> {
        return new PropertyMethodDecoratorFactoryBuilder<V, OP, OM>(this.metadataKey, this.propertyHandler, methodHandler);
    }

    public class<OC = void>(
        classHandler: ClassHandler<V, OC>
    ): PropertyMethodClassDecoratorFactoryBuilder<V, OP, OM, OC> {
        return new PropertyMethodClassDecoratorFactoryBuilder<V, OP, OM, OC>(
            this.metadataKey, this.propertyHandler, this.methodHandler, classHandler);
    }

    public property<OP = void>(
        propertyHandler: PropertyHandler<V, OP>
    ): PropertyMethodDecoratorFactoryBuilder<V, OP, OM> {
        return new PropertyMethodDecoratorFactoryBuilder<V, OP, OM>(this.metadataKey, propertyHandler, this.methodHandler);
    }
}

export {PropertyMethodDecoratorFactory, PropertyMethodDecoratorFactoryBuilder};
