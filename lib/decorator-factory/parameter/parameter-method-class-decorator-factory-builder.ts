import {AbstractDecoratorFactoryBuilder,} from '../abstract-decorator-factory-builder';
import {ParameterHandler} from '../../bean/parameter-handler';
import {PropertyHandler} from '../../bean/property-handler';
import {ClassHandler} from '../../bean/class-handler';
import {MethodHandler} from '../../bean/method-handler';
import {DecoratorUtil} from '../../decorator-util';
import {ParameterMethodDecoratorFactory} from './parameter-method-decorator-factory-builder';
import {ParameterClassDecoratorFactory} from './parameter-class-decorator-factory-builder';
import {ParameterDecoratorFactory} from './parameter-decorator-factory-builder';
import {MethodDecoratorFactory} from '../method/method-decorator-factory-builder';
import {ClassDecoratorFactory} from '../class/class-decorator-factory-builder';
import {ParameterPropertyMethodClassDecoratorFactoryBuilder} from './parameter-property-method-class-decorator-factory-builder';
import {MethodClassDecoratorFactory} from '../method/method-class-decorator-factory-builder';
import {MetadataDecoratorFactory} from "../../bean/metadata-decorator-factory";


type DecoratorFactoryUnionType<OPA, OM, OC> = ParameterDecoratorFactory<OPA> & MethodDecoratorFactory<OM> & ClassDecoratorFactory<OC>;

type ParameterMethodClassDecoratorFactory<OPA, OM, OC> = OPA extends OM
    ? OM extends OPA
        ? OPA extends OC
            ? OC extends OPA
                ? (options: OPA) => PropertyDecorator & MethodDecorator & ClassDecorator
                : ParameterMethodDecoratorFactory<OPA, OM> & ClassDecoratorFactory<OC>
            : ParameterMethodDecoratorFactory<OPA, OM> & ClassDecoratorFactory<OC>
        : OPA extends OC
            ? OC extends OPA
                ? ParameterClassDecoratorFactory<OPA, OC> & MethodDecoratorFactory<OM>
                : MethodClassDecoratorFactory<OM, OC> & ParameterDecoratorFactory<OPA>
            : MethodClassDecoratorFactory<OM, OC> & ParameterDecoratorFactory<OPA>
    : OPA extends OC
        ? OC extends OPA
            ? ParameterClassDecoratorFactory<OPA, OC> & MethodDecoratorFactory<OM>
            : MethodClassDecoratorFactory<OM, OC> & ParameterDecoratorFactory<OPA>
        : DecoratorFactoryUnionType<OPA, OM, OC>;

class ParameterMethodClassDecoratorFactoryBuilder<V, OPA, OM, OC>
    extends AbstractDecoratorFactoryBuilder<V, ParameterMethodClassDecoratorFactory<OPA, OM, OC>> {

    constructor(
        public metadataKey: string | symbol | undefined,
        public parameterHandler: ParameterHandler<V, OPA>,
        public methodHandler: MethodHandler<V, OM>,
        public classHandler: ClassHandler<V, OC>
    ) {
        super(metadataKey);
    }

    public build(): MetadataDecoratorFactory<ParameterMethodClassDecoratorFactory<OPA, OM, OC>, V> {
        return <any> DecoratorUtil.makeParameterAndPropertyAndMethodAndClassDecorator<OPA, void, OM, OC, V>(
            this.parameterHandler, undefined, this.methodHandler, this.classHandler, this.metadataKey);
    }

    public parameter<OPA = void>(
        parameterHandler: ParameterHandler<V, OPA>
    ): ParameterMethodClassDecoratorFactoryBuilder<V, OPA, OM, OC> {
        return new ParameterMethodClassDecoratorFactoryBuilder<V, OPA, OM, OC>(
            this.metadataKey, parameterHandler, this.methodHandler, this.classHandler);
    }
    public method<OM = void>(
        methodHandler: MethodHandler<V, OM>
    ): ParameterMethodClassDecoratorFactoryBuilder<V, OPA, OM, OC> {
        return new ParameterMethodClassDecoratorFactoryBuilder<V, OPA, OM, OC>(
            this.metadataKey, this.parameterHandler, methodHandler, this.classHandler);
    }
    public class<OC = void>(classHandler: ClassHandler<V, OC>): ParameterMethodClassDecoratorFactoryBuilder<V, OPA, OM, OC> {
        return new ParameterMethodClassDecoratorFactoryBuilder<V, OPA, OM, OC>(
            this.metadataKey, this.parameterHandler, this.methodHandler, classHandler);
    }

    public property<OP = void>(propertyHandler: PropertyHandler<V, OP>)
        : ParameterPropertyMethodClassDecoratorFactoryBuilder<V, OPA, OP, OM, OC> {
        return new ParameterPropertyMethodClassDecoratorFactoryBuilder<V, OPA, OP, OM, OC>(
            this.metadataKey, this.parameterHandler, propertyHandler, this.methodHandler, this.classHandler);
    }

}

export {ParameterMethodClassDecoratorFactory, ParameterMethodClassDecoratorFactoryBuilder};
