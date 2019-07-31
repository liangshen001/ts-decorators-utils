abstract class AbstractDecoratorFactoryBuilder<V, D> {

    constructor(public metadataKey: symbol | string | undefined) {}

    public abstract parameter<OPA>(
        parameterHandler: ParameterHandler<V, OPA>
    ): AbstractDecoratorFactoryBuilder<V, any>;

    public abstract property<OP>(
        propertyHandler: PropertyHandler<V, OP>
    ): AbstractDecoratorFactoryBuilder<V, any>;

    public abstract method<OM>(
        methodHandler: MethodHandler<V, OM>
    ): AbstractDecoratorFactoryBuilder<V, any>;

    public abstract class<OC>(
        classHandler: ClassHandler<V, OC>
    ): AbstractDecoratorFactoryBuilder<V, any>;

    protected abstract build(): D;
}

type ParameterHandler<V, OPA> = (option: OPA, target: Object, propertyKey: string | symbol, parameterIndex: number) => V;

type PropertyHandler<V, OP> = (option: OP, target: Object, propertyKey: string | symbol) => V;

type MethodHandler<V, OM> =
    <T>(option: OM, target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<T>) => V

type ClassHandler<V, OC> = <TFunction extends Function>(option: OC, target: TFunction) => V;


export {AbstractDecoratorFactoryBuilder, ParameterHandler, PropertyHandler, MethodHandler, ClassHandler};

