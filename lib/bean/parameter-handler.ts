export type ParameterHandler<V, OPA> =
    ((option: OPA, target: Object, propertyKey: string, parameterIndex: number, type: FunctionConstructor) => V) | void;
