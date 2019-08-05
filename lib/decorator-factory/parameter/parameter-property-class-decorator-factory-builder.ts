import {
    AbstractDecoratorFactoryBuilder,
} from '../abstract-decorator-factory-builder';
import {ParameterHandler} from '../../bean/parameter-handler';
import {PropertyHandler} from '../../bean/property-handler';
import {ClassHandler} from '../../bean/class-handler';
import {MethodHandler} from '../../bean/method-handler';
import {DecoratorUtil} from '../../decorator-util';
import {ParameterMethodDecoratorFactory, ParameterMethodDecoratorFactoryBuilder} from './parameter-method-decorator-factory-builder';
import {ParameterClassDecoratorFactory, ParameterClassDecoratorFactoryBuilder} from './parameter-class-decorator-factory-builder';
import {ParameterPropertyDecoratorFactory, ParameterPropertyDecoratorFactoryBuilder} from './parameter-property-decorator-factory-builder';
import {ParameterDecoratorFactory} from './parameter-decorator-factory-builder';
import {PropertyDecoratorFactory} from '../property/property-decorator-factory-builder';
import {ClassDecoratorFactory} from '../class/class-decorator-factory-builder';
import {ParameterPropertyMethodClassDecoratorFactoryBuilder} from './parameter-property-method-class-decorator-factory-builder';
import {MetadataKey} from '../../bean/metadata-key';
import {MethodDecoratorFactory} from '../method/method-decorator-factory-builder';
import {MethodClassDecoratorFactory} from '../method/method-class-decorator-factory-builder';
import {PropertyClassDecoratorFactory} from '../property/property-class-decorator-factory-builder';


type DecoratorFactoryUnionType<OPA, OP, OC> = ParameterDecoratorFactory<OPA> & PropertyDecoratorFactory<OP> & ClassDecoratorFactory<OC>;

type ParameterPropertyClassDecoratorFactory<OPA, OP, OC> = OPA extends OP
    ? OP extends OPA
        ? OPA extends OC
            ? OC extends OPA
                ? (options: OPA) => PropertyDecorator & MethodDecorator & ClassDecorator
                : ParameterPropertyDecoratorFactory<OPA, OP> & ClassDecoratorFactory<OC>
            : ParameterPropertyDecoratorFactory<OPA, OP> & ClassDecoratorFactory<OC>
        : OPA extends OC
            ? OC extends OPA
                ? ParameterClassDecoratorFactory<OPA, OC> & PropertyDecoratorFactory<OP>
                : PropertyClassDecoratorFactory<OP, OC> & ParameterDecoratorFactory<OPA>
            : PropertyClassDecoratorFactory<OP, OC> & ParameterDecoratorFactory<OPA>
    : OPA extends OC
        ? OC extends OPA
            ? ParameterClassDecoratorFactory<OPA, OC> & PropertyDecoratorFactory<OP>
            : PropertyClassDecoratorFactory<OP, OC> & ParameterDecoratorFactory<OPA>
        : DecoratorFactoryUnionType<OPA, OP, OC>;

class ParameterPropertyClassDecoratorFactoryBuilder<V, OPA, OP, OC>
    extends AbstractDecoratorFactoryBuilder<V, ParameterPropertyClassDecoratorFactory<OPA, OP, OC>> {

    constructor(
        public metadataKey: string | symbol | undefined,
        public parameterHandler: ParameterHandler<V, OPA>,
        public propertyHandler: PropertyHandler<V, OP>,
        public classHandler: ClassHandler<V, OC>,
    ) {
        super(metadataKey);
    }

    public build(): ParameterPropertyClassDecoratorFactory<OPA, OP, OC> {
        return <any> DecoratorUtil.makeParameterAndPropertyAndMethodAndClassDecorator<OPA, OP, void, OC, V>(
            this.parameterHandler, this.propertyHandler, undefined, this.classHandler, this.metadataKey);
    }

    public parameter<OPA = void>(
        parameterHandler: ParameterHandler<V, OPA>
    ): ParameterPropertyClassDecoratorFactoryBuilder<V, OPA, OP, OC> {
        return new ParameterPropertyClassDecoratorFactoryBuilder<V, OPA, OP, OC>(
            this.metadataKey, parameterHandler, this.propertyHandler, this.classHandler);
    }
    public method<OM = void>(
        methodHandler: MethodHandler<V, OM>
    ): ParameterPropertyMethodClassDecoratorFactoryBuilder<V, OPA, OP, OM, OC> {
        return new ParameterPropertyMethodClassDecoratorFactoryBuilder<V, OPA, OP, OM, OC>(
            this.metadataKey, this.parameterHandler, this.propertyHandler, methodHandler, this.classHandler);
    }
    public class<OC = void>(classHandler: ClassHandler<V, OC>): ParameterPropertyClassDecoratorFactoryBuilder<V, OPA, OP, OC> {
        return new ParameterPropertyClassDecoratorFactoryBuilder<V, OPA, OP, OC>(
            this.metadataKey, this.parameterHandler, this.propertyHandler, classHandler);
    }

    public property<OP = void>(propertyHandler: PropertyHandler<V, OP>): ParameterPropertyClassDecoratorFactoryBuilder<V, OPA, OP, OC> {
        return new ParameterPropertyClassDecoratorFactoryBuilder<V, OPA, OP, OC>(
            this.metadataKey, this.parameterHandler, propertyHandler, this.classHandler);
    }

}

export {ParameterPropertyClassDecoratorFactory, ParameterPropertyClassDecoratorFactoryBuilder};
