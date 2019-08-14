import {AbstractDecoratorFactoryBuilder,} from '../abstract-decorator-factory-builder';
import {ParameterHandler} from '../../bean/parameter-handler';
import {PropertyHandler} from '../../bean/property-handler';
import {ClassHandler} from '../../bean/class-handler';
import {MethodHandler} from '../../bean/method-handler';
import {ParameterMethodDecoratorFactoryBuilder} from '../parameter/parameter-method-decorator-factory-builder';
import {MethodClassDecoratorFactoryBuilder} from './method-class-decorator-factory-builder';
import {PropertyMethodDecoratorFactoryBuilder} from '../property/property-method-decorator-factory-builder';
import {MetadataDecoratorFactory} from "../../bean/metadata-decorator-factory";
import {MakeDecoratorUtil} from "../../make-decorator-util";

type MethodDecoratorFactory<OM> = (option: OM) => MethodDecorator;

class MethodDecoratorFactoryBuilder<V, OM> extends AbstractDecoratorFactoryBuilder<V, MethodDecoratorFactory<OM>> {

    constructor(
        public metadataKey: string | symbol | undefined,
        public methodHandler: MethodHandler<V, OM>
    ) {
        super(metadataKey);
    }

    public build(): MetadataDecoratorFactory<MethodDecoratorFactory<OM>, V> {
        return MakeDecoratorUtil.makeParameterAndPropertyAndMethodAndClassDecorator<void, void, OM, void, V>(
            undefined, undefined, this.methodHandler, undefined, this.metadataKey);
    }

    public parameter<OPA = void>(
        parameterHandler: ParameterHandler<V, OPA>
    ): ParameterMethodDecoratorFactoryBuilder<V, OPA, OM> {
        return new ParameterMethodDecoratorFactoryBuilder<V, OPA, OM>(this.metadataKey, parameterHandler, this.methodHandler);
    }

    public method<OM = void>(
        methodHandler: MethodHandler<V, OM>
    ): MethodDecoratorFactoryBuilder<V, OM> {
        return new MethodDecoratorFactoryBuilder<V, OM>(this.metadataKey, methodHandler);
    }
    public class<OC = void>(
        classHandler: ClassHandler<V, OC>
    ): MethodClassDecoratorFactoryBuilder<V, OM, OC> {
        return new MethodClassDecoratorFactoryBuilder<V, OM, OC>(this.metadataKey, this.methodHandler, classHandler);
    }

    public property<OP = void>(
        propertyHandler: PropertyHandler<V, OP>
    ): PropertyMethodDecoratorFactoryBuilder<V, OP, OM> {
        return new PropertyMethodDecoratorFactoryBuilder<V, OP, OM>(this.metadataKey, propertyHandler, this.methodHandler);
    }
}

export {MethodDecoratorFactory, MethodDecoratorFactoryBuilder};
