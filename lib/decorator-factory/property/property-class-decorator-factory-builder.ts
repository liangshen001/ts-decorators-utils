import {
    AbstractDecoratorFactoryBuilder,
} from '../abstract-decorator-factory-builder';
import {ParameterHandler} from '../../bean/parameter-handler';
import {PropertyHandler} from '../../bean/property-handler';
import {ClassHandler} from '../../bean/class-handler';
import {MethodHandler} from '../../bean/method-handler';
import {DecoratorUtil} from '../../decorator-util';
import {MethodClassDecoratorFactoryBuilder} from '../method/method-class-decorator-factory-builder';
import {PropertyDecoratorFactory, PropertyDecoratorFactoryBuilder} from './property-decorator-factory-builder';
import {ClassDecoratorFactory} from '../class/class-decorator-factory-builder';
import {PropertyMethodClassDecoratorFactoryBuilder} from './property-method-class-decorator-factory-builder';
import {ParameterPropertyClassDecoratorFactoryBuilder} from '../parameter/parameter-property-class-decorator-factory-builder';
import {MetadataKey} from '../../bean/metadata-key';

type PropertyClassDecoratorFactory<OP, OC> = PropertyDecoratorFactory<OP> & ClassDecoratorFactory<OC>;

class PropertyClassDecoratorFactoryBuilder<V, OP, OC>
    extends AbstractDecoratorFactoryBuilder<V, PropertyClassDecoratorFactory<OP, OC>> {

    constructor(
        public metadataKey: MetadataKey<V> | undefined,
        public propertyHandler: PropertyHandler<V, OP>,
        public classHandler: ClassHandler<V, OC>
    ) {
        super(metadataKey);
    }

    public build(): PropertyClassDecoratorFactory<OP, OC> {
        return DecoratorUtil.makeParameterAndPropertyAndMethodAndClassDecorator<void, OP, void, OC, V>(
            undefined, this.propertyHandler, undefined, this.classHandler, this.metadataKey);
    }
    public class<OC = void>(
        classHandler: ClassHandler<V, OC>
    ): PropertyClassDecoratorFactoryBuilder<V, OP, OC> {
        return new PropertyClassDecoratorFactoryBuilder<V, OP, OC>(this.metadataKey, this.propertyHandler, classHandler);
    }

    public method<OM = void>(
        methodHandler: MethodHandler<V, OM>
    ): PropertyMethodClassDecoratorFactoryBuilder<V, OP, OM, OC> {
        return new PropertyMethodClassDecoratorFactoryBuilder<V, OP, OM, OC>(
            this.metadataKey, this.propertyHandler, methodHandler, this.classHandler);
    }

    public property<OP = void>(
        propertyHandler: PropertyHandler<V, OP>
    ): PropertyClassDecoratorFactoryBuilder<V, OP, OC> {
        return new PropertyClassDecoratorFactoryBuilder<V, OP, OC>(this.metadataKey, propertyHandler, this.classHandler);
    }

    public parameter<OPA = void>(
        parameterHandler: ParameterHandler<V, OPA>
    ): ParameterPropertyClassDecoratorFactoryBuilder<V, OPA, OP, OC> {
        return new ParameterPropertyClassDecoratorFactoryBuilder<V, OPA, OP, OC>(
            this.metadataKey, parameterHandler, this.propertyHandler, this.classHandler
        );
    }

}

export {PropertyClassDecoratorFactory, PropertyClassDecoratorFactoryBuilder};
