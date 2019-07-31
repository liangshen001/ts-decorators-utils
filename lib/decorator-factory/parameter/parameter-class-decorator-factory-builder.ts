import {
    AbstractDecoratorFactoryBuilder,
    ClassHandler,
    MethodHandler,
    ParameterHandler,
    PropertyHandler
} from '../abstract-decorator-factory-builder';
import {DecoratorUtil} from '../../decorator-util';
import {ParameterDecoratorFactory} from './parameter-decorator-factory-builder';
import {ClassDecoratorFactory} from '../class/class-decorator-factory-builder';
import {ParameterMethodClassDecoratorFactoryBuilder} from './parameter-method-class-decorator-factory-builder';
import {ParameterPropertyClassDecoratorFactoryBuilder} from './parameter-property-class-decorator-factory-builder';

type ParameterClassDecoratorFactory<OPA, OC> = ParameterDecoratorFactory<OPA> & ClassDecoratorFactory<OC>;

class ParameterClassDecoratorFactoryBuilder<V, OPA, OC>
    extends AbstractDecoratorFactoryBuilder<V, ParameterClassDecoratorFactory<OPA, OC>> {

    constructor(
        public metadataKey: symbol | string | undefined,
        public parameterHandler: ParameterHandler<V, OPA>,
        public classHandler: ClassHandler<V, OC>
    ) {
        super(metadataKey);
    }

    public build(): ParameterClassDecoratorFactory<OPA, OC> {
        return DecoratorUtil.makeParameterAndPropertyAndMethodAndClassDecorator<OPA, void, void, OC, V>(
            this.parameterHandler, undefined, undefined, this.classHandler, this.metadataKey);
    }

    public parameter<OPA = void>(
        parameterHandler: ParameterHandler<V, OPA>
    ): ParameterClassDecoratorFactoryBuilder<V, OPA, OC> {
        return new ParameterClassDecoratorFactoryBuilder<V, OPA, OC>(this.metadataKey, parameterHandler, this.classHandler);
    }
    public method<OM = void>(
        methodHandler: MethodHandler<V, OM>
    ): ParameterMethodClassDecoratorFactoryBuilder<V, OPA, OM, OC> {
        return new ParameterMethodClassDecoratorFactoryBuilder<V, OPA, OM, OC>(
            this.metadataKey, this.parameterHandler, methodHandler, this.classHandler);
    }
    public class<OC = void>(classHandler: ClassHandler<V, OC>): ParameterClassDecoratorFactoryBuilder<V, OPA, OC> {
        return new ParameterClassDecoratorFactoryBuilder<V, OPA, OC>(this.metadataKey, this.parameterHandler, classHandler);
    }

    public property<OP = void>(propertyHandler: PropertyHandler<V, OP>): ParameterPropertyClassDecoratorFactoryBuilder<V, OPA, OP, OC> {
        return new ParameterPropertyClassDecoratorFactoryBuilder<V, OPA, OP, OC>(
            this.metadataKey, this.parameterHandler, propertyHandler, this.classHandler);
    }

}

export {ParameterClassDecoratorFactory, ParameterClassDecoratorFactoryBuilder};
