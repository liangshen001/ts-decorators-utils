import {
    AbstractDecoratorFactoryBuilder
} from '../abstract-decorator-factory-builder';
import {ParameterHandler} from '../../bean/parameter-handler';
import {PropertyHandler} from '../../bean/property-handler';
import {ClassHandler} from '../../bean/class-handler';
import {MethodHandler} from '../../bean/method-handler';
import {MethodDecoratorFactory} from './method-decorator-factory-builder';
import {ClassDecoratorFactory} from '../class/class-decorator-factory-builder';
import {DecoratorUtil} from '../../decorator-util';
import {PropertyMethodClassDecoratorFactoryBuilder} from '../property/property-method-class-decorator-factory-builder';
import {ParameterMethodClassDecoratorFactoryBuilder} from '../parameter/parameter-method-class-decorator-factory-builder';
import {MetadataKey} from '../../bean/metadata-key';

type MethodClassDecoratorFactory<OM, OC> = MethodDecoratorFactory<OM> & ClassDecoratorFactory<OC>;

class MethodClassDecoratorFactoryBuilder<V, OM, OC> extends AbstractDecoratorFactoryBuilder<V, MethodClassDecoratorFactory<OM, OC>> {

    constructor(
        public metadataKey: MetadataKey<V> | undefined,
        public methodHandler: MethodHandler<V, OM>,
        public classHandler: ClassHandler<V, OC>
    ) {
        super(metadataKey);
    }

    public build(): MethodClassDecoratorFactory<OM, OC> {
        return DecoratorUtil.makeParameterAndPropertyAndMethodAndClassDecorator<void, void, OM, OC, V>(
            undefined, undefined, this.methodHandler, this.classHandler, this.metadataKey);
    }

    public class<OC = void>(classHandler: ClassHandler<V, OC>): MethodClassDecoratorFactoryBuilder<V, OM, OC> {
        return new MethodClassDecoratorFactoryBuilder<V, OM, OC>(this.metadataKey, this.methodHandler, classHandler);
    }

    public method<OM = void>(methodHandler: MethodHandler<V, OM>): MethodClassDecoratorFactoryBuilder<V, OM, OC> {
        return new MethodClassDecoratorFactoryBuilder<V, OM, OC>(this.metadataKey, methodHandler, this.classHandler);
    }
    public property<OP = void>(propertyHandler: PropertyHandler<V, OP>): PropertyMethodClassDecoratorFactoryBuilder<V, OP, OM, OC> {
        return new PropertyMethodClassDecoratorFactoryBuilder<V, OP, OM, OC>(
            this.metadataKey, propertyHandler, this.methodHandler, this.classHandler);
    }

    public parameter<OPA = void>(parameterHandler: ParameterHandler<V, OPA>): ParameterMethodClassDecoratorFactoryBuilder<V, OPA, OM, OC> {
        return new ParameterMethodClassDecoratorFactoryBuilder<V, OPA, OM, OC>(
            this.metadataKey, parameterHandler, this.methodHandler, this.classHandler
        );
    }

}
export {MethodClassDecoratorFactory, MethodClassDecoratorFactoryBuilder};
