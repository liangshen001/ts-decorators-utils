import {
    AbstractDecoratorFactoryBuilder,
} from '../abstract-decorator-factory-builder';
import {ParameterHandler} from '../../bean/parameter-handler';
import {PropertyHandler} from '../../bean/property-handler';
import {ClassHandler} from '../../bean/class-handler';
import {MethodHandler} from '../../bean/method-handler';
import {ClassDecoratorFactory} from '../class/class-decorator-factory-builder';
import {DecoratorUtil} from '../../decorator-util';
import {PropertyDecoratorFactory} from './property-decorator-factory-builder';
import {MethodDecoratorFactory} from '../method/method-decorator-factory-builder';
import {ParameterPropertyMethodClassDecoratorFactoryBuilder} from '../parameter/parameter-property-method-class-decorator-factory-builder';
import {MetadataKey} from '../../bean/metadata-key';
import {PropertyMethodDecoratorFactory} from './property-method-decorator-factory-builder';
import {PropertyClassDecoratorFactory} from './property-class-decorator-factory-builder';
import {MethodClassDecoratorFactory} from '../method/method-class-decorator-factory-builder';


type DecoratorFactoryUnionType<OP, OM, OC> = MethodDecoratorFactory<OM> & ClassDecoratorFactory<OC> & PropertyDecoratorFactory<OP>;

type PropertyMethodClassDecoratorFactory<OP, OM, OC> = OP extends OM
    ? OM extends OP
        ? OP extends OC
            ? OC extends OP
                ? (options: OP) => PropertyDecorator & MethodDecorator & ClassDecorator
                : PropertyMethodDecoratorFactory<OP, OM> & ClassDecoratorFactory<OC>
            : PropertyMethodDecoratorFactory<OP, OM> & ClassDecoratorFactory<OC>
        : OP extends OC
            ? OC extends OP
                ? PropertyClassDecoratorFactory<OP, OC> & MethodDecoratorFactory<OM>
                : MethodClassDecoratorFactory<OM, OC> & PropertyDecoratorFactory<OP>
            : MethodClassDecoratorFactory<OM, OC> & PropertyDecoratorFactory<OP>
    : OP extends OC
        ? OC extends OP
            ? PropertyClassDecoratorFactory<OP, OC> & MethodDecoratorFactory<OM>
            : MethodClassDecoratorFactory<OM, OC> & PropertyDecoratorFactory<OP>
        : DecoratorFactoryUnionType<OP, OM, OC>;

class PropertyMethodClassDecoratorFactoryBuilder<V, OP, OM, OC>
    extends AbstractDecoratorFactoryBuilder<V, PropertyMethodClassDecoratorFactory<OP, OM, OC>> {

    constructor(
        public metadataKey: MetadataKey<V> | undefined,
        public propertyHandler: PropertyHandler<V, OP>,
        public methodHandler: MethodHandler<V, OM>,
        public classHandler: ClassHandler<V, OC>
    ) {
        super(metadataKey);
    }

    public build(): PropertyMethodClassDecoratorFactory<OP, OM, OC> {
        return <any> DecoratorUtil.makeParameterAndPropertyAndMethodAndClassDecorator<void, OP, OM, OC, V>(
            undefined, this.propertyHandler, this.methodHandler, this.classHandler, this.metadataKey);
    }

    public class<OC = void>(classHandler: ClassHandler<V, OC>): PropertyMethodClassDecoratorFactoryBuilder<V, OP, OM, OC> {
        return new PropertyMethodClassDecoratorFactoryBuilder<V, OP, OM, OC>(
            this.metadataKey, this.propertyHandler, this.methodHandler, classHandler);
    }

    public method<OM = void>(methodHandler: MethodHandler<V, OM>): PropertyMethodClassDecoratorFactoryBuilder<V, OP, OM, OC> {
        return new PropertyMethodClassDecoratorFactoryBuilder<V, OP, OM, OC>(
            this.metadataKey, this.propertyHandler, methodHandler, this.classHandler);
    }
    public property<OP = void>(propertyHandler: PropertyHandler<V, OP>): PropertyMethodClassDecoratorFactoryBuilder<V, OP, OM, OC> {
        return new PropertyMethodClassDecoratorFactoryBuilder<V, OP, OM, OC>(
            this.metadataKey, propertyHandler, this.methodHandler, this.classHandler
        );
    }

    public parameter<OPA = void>(parameterHandler: ParameterHandler<V, OPA>)
        : ParameterPropertyMethodClassDecoratorFactoryBuilder<V, OPA, OP, OM, OC> {
        return new ParameterPropertyMethodClassDecoratorFactoryBuilder<V, OPA, OP, OM, OC>(
            this.metadataKey, parameterHandler, this.propertyHandler, this.methodHandler, this.classHandler
        );
    }

}

export {PropertyMethodClassDecoratorFactory, PropertyMethodClassDecoratorFactoryBuilder};
