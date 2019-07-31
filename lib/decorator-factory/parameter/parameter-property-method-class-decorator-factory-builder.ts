import {
    AbstractDecoratorFactoryBuilder,
    ClassHandler,
    MethodHandler,
    ParameterHandler,
    PropertyHandler
} from '../abstract-decorator-factory-builder';
import {DecoratorUtil} from '../../decorator-util';
import {ParameterDecoratorFactory} from './parameter-decorator-factory-builder';
import {PropertyDecoratorFactory} from '../property/property-decorator-factory-builder';
import {MethodDecoratorFactory} from '../method/method-decorator-factory-builder';
import {ClassDecoratorFactory} from '../class/class-decorator-factory-builder';

type ParameterPropertyMethodClassDecoratorFactory<OPA, OP, OM, OC> =
    ParameterDecoratorFactory<OPA> & PropertyDecoratorFactory<OP> & MethodDecoratorFactory<OM> & ClassDecoratorFactory<OC>;

class ParameterPropertyMethodClassDecoratorFactoryBuilder<V, OPA, OP, OM, OC>
    extends AbstractDecoratorFactoryBuilder<V, ParameterPropertyMethodClassDecoratorFactory<OPA, OP, OM, OC>> {

    constructor(
        public metadataKey: symbol | string | undefined,
        public parameterHandler: ParameterHandler<V, OPA>,
        public propertyHandler: PropertyHandler<V, OP>,
        public methodHandler: MethodHandler<V, OM>,
        public classHandler: ClassHandler<V, OC>
    ) {
        super(metadataKey);
    }

    public build(): ParameterPropertyMethodClassDecoratorFactory<OPA, OP, OM, OC> {
        return DecoratorUtil.makeParameterAndPropertyAndMethodAndClassDecorator<OPA, OP, OM, OC, V>(
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
