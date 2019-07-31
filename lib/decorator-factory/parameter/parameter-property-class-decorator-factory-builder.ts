import {
    AbstractDecoratorFactoryBuilder,
    ClassHandler,
    MethodHandler,
    ParameterHandler,
    PropertyHandler
} from '../abstract-decorator-factory-builder';
import {DecoratorUtil} from '../../decorator-util';
import {ParameterMethodDecoratorFactoryBuilder} from './parameter-method-decorator-factory-builder';
import {ParameterClassDecoratorFactoryBuilder} from './parameter-class-decorator-factory-builder';
import {ParameterPropertyDecoratorFactoryBuilder} from './parameter-property-decorator-factory-builder';
import {ParameterDecoratorFactory} from './parameter-decorator-factory-builder';
import {PropertyDecoratorFactory} from '../property/property-decorator-factory-builder';
import {ClassDecoratorFactory} from '../class/class-decorator-factory-builder';
import {ParameterPropertyMethodClassDecoratorFactoryBuilder} from './parameter-property-method-class-decorator-factory-builder';

type ParameterPropertyClassDecoratorFactory<OPA, OP, OC> =
    ParameterDecoratorFactory<OPA> & PropertyDecoratorFactory<OP> & ClassDecoratorFactory<OC>;

class ParameterPropertyClassDecoratorFactoryBuilder<V, OPA, OP, OC>
    extends AbstractDecoratorFactoryBuilder<V, ParameterPropertyClassDecoratorFactory<OPA, OP, OC>> {

    constructor(
        public metadataKey: symbol | string | undefined,
        public parameterHandler: ParameterHandler<V, OPA>,
        public propertyHandler: PropertyHandler<V, OP>,
        public classHandler: ClassHandler<V, OC>,
    ) {
        super(metadataKey);
    }

    public build(): ParameterPropertyClassDecoratorFactory<OPA, OP, OC> {
        return DecoratorUtil.makeParameterAndPropertyAndMethodAndClassDecorator<OPA, OP, void, OC, V>(
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
