export type PropertyHandler<V, OP> =
    ((option: OP, target: Object, propertyKey: string, type: FunctionConstructor) => V) | void;
