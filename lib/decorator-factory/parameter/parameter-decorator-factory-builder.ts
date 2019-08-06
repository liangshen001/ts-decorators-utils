import {AbstractDecoratorFactoryBuilder,} from '../abstract-decorator-factory-builder';
import {ParameterHandler} from '../../bean/parameter-handler';
import {PropertyHandler} from '../../bean/property-handler';
import {ClassHandler} from '../../bean/class-handler';
import {MethodHandler} from '../../bean/method-handler';
import {DecoratorUtil} from '../../decorator-util';
import {ParameterMethodDecoratorFactoryBuilder} from './parameter-method-decorator-factory-builder';
import {ParameterClassDecoratorFactoryBuilder} from './parameter-class-decorator-factory-builder';
import {ParameterPropertyDecoratorFactoryBuilder} from './parameter-property-decorator-factory-builder';
import {MetadataDecoratorFactory} from "../../bean/metadata-decorator-factory";

type ParameterDecoratorFactory<OPA> = (option: OPA) => ParameterDecorator;

class ParameterDecoratorFactoryBuilder<V, OPA> extends AbstractDecoratorFactoryBuilder<V, ParameterDecoratorFactory<OPA>> {

    constructor(
        public metadataKey: string | symbol | undefined,
        public parameterHandler: ParameterHandler<V, OPA>
    ) {
        super(metadataKey);
    }

    public build(): MetadataDecoratorFactory<ParameterDecoratorFactory<OPA>, V> {
        return DecoratorUtil.makeParameterAndPropertyAndMethodAndClassDecorator<OPA, void, void, void, V>(
            this.parameterHandler, undefined, undefined, undefined, this.metadataKey);
    }

    public parameter<OPA = void>(
        parameterHandler: ParameterHandler<V, OPA>
    ): ParameterDecoratorFactoryBuilder<V, OPA> {
        return new ParameterDecoratorFactoryBuilder<V, OPA>(this.metadataKey, parameterHandler);
    }
    public method<OM = void>(
        methodHandler: MethodHandler<V, OM>
    ): ParameterMethodDecoratorFactoryBuilder<V, OPA, OM> {
        return new ParameterMethodDecoratorFactoryBuilder<V, OPA, OM>(this.metadataKey, this.parameterHandler, methodHandler);
    }
    public class<OC = void>(classHandler: ClassHandler<V, OC>): ParameterClassDecoratorFactoryBuilder<V, OPA, OC> {
        return new ParameterClassDecoratorFactoryBuilder<V, OPA, OC>(this.metadataKey, this.parameterHandler, classHandler);
    }

    public property<OP = void>(propertyHandler: PropertyHandler<V, OP>): ParameterPropertyDecoratorFactoryBuilder<V, OPA, OP> {
        return new ParameterPropertyDecoratorFactoryBuilder<V, OPA, OP>(this.metadataKey, this.parameterHandler, propertyHandler);
    }

}

export {ParameterDecoratorFactory, ParameterDecoratorFactoryBuilder};
