import {AbstractDecoratorFactoryBuilder} from '../abstract-decorator-factory-builder';
import {ParameterHandler} from '../../bean/parameter-handler';
import {PropertyHandler} from '../../bean/property-handler';
import {ClassHandler} from '../../bean/class-handler';
import {MethodHandler} from '../../bean/method-handler';
import {DecoratorUtil} from '../../decorator-util';
import {MethodClassDecoratorFactoryBuilder} from '../method/method-class-decorator-factory-builder';
import {PropertyClassDecoratorFactoryBuilder} from '../property/property-class-decorator-factory-builder';
import {ParameterClassDecoratorFactoryBuilder} from '../parameter/parameter-class-decorator-factory-builder';
import {MetadataDecoratorFactory} from "../../bean/metadata-decorator-factory";

type ClassDecoratorFactory<OC> = (option: OC) => ClassDecorator;

class ClassDecoratorFactoryBuilder<V, OC> extends AbstractDecoratorFactoryBuilder<V, ClassDecoratorFactory<OC>> {

    constructor(
        public metadataKey: string | symbol | undefined,
        public classHandler: ClassHandler<V, OC>
    ) {
        super(metadataKey);
    }

    public build(): MetadataDecoratorFactory<ClassDecoratorFactory<OC>, V> {
        return DecoratorUtil.makeParameterAndPropertyAndMethodAndClassDecorator<void, void, void, OC, V>(
            undefined, undefined, undefined, this.classHandler, this.metadataKey);
    }

    public class<OC = void>(
        classHandler: ClassHandler<V, OC>
    ): ClassDecoratorFactoryBuilder<V, OC> {
        return new ClassDecoratorFactoryBuilder<V, OC>(this.metadataKey, classHandler);
    }

    public method<OM = void>(
        methodHandler: MethodHandler<V, OM>
    ): MethodClassDecoratorFactoryBuilder<V, OM, OC> {
        return new MethodClassDecoratorFactoryBuilder<V, OM, OC>(this.metadataKey, methodHandler, this.classHandler);
    }

    public property<OP = void>(
        propertyHandler: PropertyHandler<V, OP>
    ): PropertyClassDecoratorFactoryBuilder<V, OP, OC> {
        return new PropertyClassDecoratorFactoryBuilder<V, OP, OC>(this.metadataKey, propertyHandler, this.classHandler);
    }

    public parameter<OPA = void>(
        parameterHandler: ParameterHandler<V, OPA>
    ): ParameterClassDecoratorFactoryBuilder<V, OPA, OC> {
        return new ParameterClassDecoratorFactoryBuilder<V, OPA, OC>(this.metadataKey, parameterHandler, this.classHandler);
    }

}

export {ClassDecoratorFactory, ClassDecoratorFactoryBuilder};
