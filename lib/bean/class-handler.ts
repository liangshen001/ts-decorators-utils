
export type ClassHandler<V, OC> =
    (<TFunction extends Function>(option: OC, target: TFunction, paramTypes: FunctionConstructor[]) => V) | void;
