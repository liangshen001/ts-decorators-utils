import {
    AbstractDecoratorFactoryBuilder,
} from '../abstract-decorator-factory-builder';
import {ParameterHandler} from '../../bean/parameter-handler';
import {PropertyHandler} from '../../bean/property-handler';
import {ClassHandler} from '../../bean/class-handler';
import {MethodHandler} from '../../bean/method-handler';
import {DecoratorUtil} from '../../decorator-util';
import {ParameterDecoratorFactory} from './parameter-decorator-factory-builder';
import {PropertyDecoratorFactory} from '../property/property-decorator-factory-builder';
import {MethodDecoratorFactory} from '../method/method-decorator-factory-builder';
import {ClassDecoratorFactory} from '../class/class-decorator-factory-builder';
import {MetadataKey} from '../../bean/metadata-key';
import {ParameterPropertyDecoratorFactory} from './parameter-property-decorator-factory-builder';
import {ParameterMethodDecoratorFactory} from './parameter-method-decorator-factory-builder';
import {PropertyMethodDecoratorFactory} from '../property/property-method-decorator-factory-builder';

type DecoratorFactoryUnionType<OPA, OP, OM, OC> =
    ParameterDecoratorFactory<OPA> & PropertyDecoratorFactory<OP> & MethodDecoratorFactory<OM> & ClassDecoratorFactory<OC>;

type ParameterPropertyMethodClassDecoratorFactory<OPA, OP, OM, OC> = DecoratorFactoryUnionType<OPA, OP, OM, OC>;

// OPA extends OP
    // ? OP extends OPA
    //     ? OPA extends OM
    //         ? OM extends OPA
    //             ? (options: OPA) => PropertyDecorator & MethodDecorator & ClassDecorator
    //             : ParameterPropertyDecoratorFactory<OPA, OP> & MethodDecoratorFactory<OM>
    //         : ParameterPropertyDecoratorFactory<OPA, OP> & MethodDecoratorFactory<OM>
    //     : OPA extends OM
    //         ? OM extends OPA
    //             ? ParameterMethodDecoratorFactory<OPA, OM> & PropertyDecoratorFactory<OP>
    //             : PropertyMethodDecoratorFactory<OP, OM> & ParameterDecoratorFactory<OPA>
    //         : PropertyMethodDecoratorFactory<OP, OM> & ParameterDecoratorFactory<OPA>
    // : OPA extends OM
    //     ? OM extends OPA
    //         ? ParameterMethodDecoratorFactory<OPA, OM> & PropertyDecoratorFactory<OP>
    //         : PropertyMethodDecoratorFactory<OP, OM> & ParameterDecoratorFactory<OPA>
    //     : DecoratorFactoryUnionType<OPA, OP, OM, OC>;

class ParameterPropertyMethodClassDecoratorFactoryBuilder<V, OPA, OP, OM, OC>
    extends AbstractDecoratorFactoryBuilder<V, ParameterPropertyMethodClassDecoratorFactory<OPA, OP, OM, OC>> {

    constructor(
        public metadataKey: MetadataKey<V> | undefined,
        public parameterHandler: ParameterHandler<V, OPA>,
        public propertyHandler: PropertyHandler<V, OP>,
        public methodHandler: MethodHandler<V, OM>,
        public classHandler: ClassHandler<V, OC>
    ) {
        super(metadataKey);
    }

    public build(): ParameterPropertyMethodClassDecoratorFactory<OPA, OP, OM, OC> {
        return <any> DecoratorUtil.makeParameterAndPropertyAndMethodAndClassDecorator<OPA, OP, OM, OC, V>(
            this.parameterHandler, this.propertyHandler, this.methodHandler, this.classHandler, this.metadataKey);
    }

    public parameter<OPA = void>(
        parameterHandler: ParameterHandler<V, OPA>
    ): ParameterPropertyMethodClassDecoratorFactoryBuilder<V, OPA, OP, OM, OC> {
        return new ParameterPropertyMethodClassDecoratorFactoryBuilder<V, OPA, OP, OM, OC>(
            this.metadataKey, parameterHandler, this.propertyHandler, this.methodHandler, this.classHandler);
    }
    public method<OM = void>(
        methodHandler: MethodHandler<V, OM>
    ): ParameterPropertyMethodClassDecoratorFactoryBuilder<V, OPA, OP, OM, OC> {
        return new ParameterPropertyMethodClassDecoratorFactoryBuilder<V, OPA, OP, OM, OC>(
            this.metadataKey, this.parameterHandler, this.propertyHandler, methodHandler, this.classHandler);
    }
    public class<OC = void>(classHandler: ClassHandler<V, OC>): ParameterPropertyMethodClassDecoratorFactoryBuilder<V, OPA, OP, OM, OC> {
        return new ParameterPropertyMethodClassDecoratorFactoryBuilder<V, OPA, OP, OM, OC>(
            this.metadataKey, this.parameterHandler, this.propertyHandler, this.methodHandler, classHandler);
    }

    public property<OP = void>(propertyHandler: PropertyHandler<V, OP>)
        : ParameterPropertyMethodClassDecoratorFactoryBuilder<V, OPA, OP, OM, OC> {
        return new ParameterPropertyMethodClassDecoratorFactoryBuilder<V, OPA, OP, OM, OC>(
            this.metadataKey, this.parameterHandler, propertyHandler, this.methodHandler, this.classHandler);
    }

}

export {ParameterPropertyMethodClassDecoratorFactory, ParameterPropertyMethodClassDecoratorFactoryBuilder};
