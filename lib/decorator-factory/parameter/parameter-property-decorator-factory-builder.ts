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
import {ParameterPropertyMethodDecoratorFactoryBuilder} from './parameter-property-method-decorator-factory-builder';
import {ParameterPropertyClassDecoratorFactoryBuilder} from './parameter-property-class-decorator-factory-builder';

type ParameterPropertyDecoratorFactory<OPA, OP> = ParameterDecoratorFactory<OPA> & PropertyDecoratorFactory<OP>;

class ParameterPropertyDecoratorFactoryBuilder<V, OPA, OP>
    extends AbstractDecoratorFactoryBuilder<V, ParameterPropertyDecoratorFactory<OPA, OP>> {

    constructor(
        public metadataKey: symbol | string | undefined,
        public parameterHandler: ParameterHandler<V, OPA>,
        public propertyHandler: PropertyHandler<V, OP>
    ) {
        super(metadataKey);
    }

    public build(): ParameterPropertyDecoratorFactory<OPA, OP> {
        return DecoratorUtil.makeParameterAndPropertyAndMethodAndClassDecorator<OPA, OP, void, void, V>(
            this.parameterHandler, this.propertyHandler, undefined, undefined, this.metadataKey);
    }

    public parameter<OPA = void>(
        parameterHandler: ParameterHandler<V, OPA>
    ): ParameterPropertyDecoratorFactoryBuilder<V, OPA, OP> {
        return new ParameterPropertyDecoratorFactoryBuilder<V, OPA, OP>(this.metadataKey, parameterHandler, this.propertyHandler);
    }
    public method<OM = void>(
        methodHandler: MethodHandler<V, OM>
    ): ParameterPropertyMethodDecoratorFactoryBuilder<V, OPA, OP, OM> {
        return new ParameterPropertyMethodDecoratorFactoryBuilder<V, OPA, OP, OM>(
            this.metadataKey, this.parameterHandler, this.propertyHandler, methodHandler
        );
    }

    public class<OC = void>(classHandler: ClassHandler<V, OC>): ParameterPropertyClassDecoratorFactoryBuilder<V, OPA, OP, OC> {
        return new ParameterPropertyClassDecoratorFactoryBuilder<V, OPA, OP, OC>(
            this.metadataKey, this.parameterHandler, this.propertyHandler, classHandler
        );
    }

    public property<OP = void>(propertyHandler: PropertyHandler<V, OP>): ParameterPropertyDecoratorFactoryBuilder<V, OPA, OP> {
        return new ParameterPropertyDecoratorFactoryBuilder<V, OPA, OP>(this.metadataKey, this.parameterHandler, propertyHandler);
    }

}

export {ParameterPropertyDecoratorFactory, ParameterPropertyDecoratorFactoryBuilder};
