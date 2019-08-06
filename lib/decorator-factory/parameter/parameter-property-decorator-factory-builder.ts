import {AbstractDecoratorFactoryBuilder,} from '../abstract-decorator-factory-builder';
import {ParameterHandler} from '../../bean/parameter-handler';
import {PropertyHandler} from '../../bean/property-handler';
import {ClassHandler} from '../../bean/class-handler';
import {MethodHandler} from '../../bean/method-handler';
import {DecoratorUtil} from '../../decorator-util';
import {ParameterDecoratorFactory} from './parameter-decorator-factory-builder';
import {PropertyDecoratorFactory} from '../property/property-decorator-factory-builder';
import {ParameterPropertyMethodDecoratorFactoryBuilder} from './parameter-property-method-decorator-factory-builder';
import {ParameterPropertyClassDecoratorFactoryBuilder} from './parameter-property-class-decorator-factory-builder';
import {MetadataDecoratorFactory} from "../../bean/metadata-decorator-factory";

type DecoratorFactoryUnionType<OPA, OP>  = ParameterDecoratorFactory<OPA> & PropertyDecoratorFactory<OP>

type ParameterPropertyDecoratorFactory<OPA, OP> = OPA extends OP
    ? OP extends OPA
        ? (option: OPA) => ParameterDecorator & PropertyDecorator
        : DecoratorFactoryUnionType<OPA, OP>
    : DecoratorFactoryUnionType<OPA, OP>;

class ParameterPropertyDecoratorFactoryBuilder<V, OPA, OP>
    extends AbstractDecoratorFactoryBuilder<V, ParameterPropertyDecoratorFactory<OPA, OP>> {

    constructor(
        public metadataKey: string | symbol | undefined,
        public parameterHandler: ParameterHandler<V, OPA>,
        public propertyHandler: PropertyHandler<V, OP>
    ) {
        super(metadataKey);
    }

    public build(): MetadataDecoratorFactory<ParameterPropertyDecoratorFactory<OPA, OP>, V> {
        return <any> DecoratorUtil.makeParameterAndPropertyAndMethodAndClassDecorator<OPA, OP, void, void, V>(
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
