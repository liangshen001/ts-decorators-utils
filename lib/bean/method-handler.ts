export type MethodHandler<V, OM> = (<T>(option: OM, target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<T>,
                                        paramTypes: FunctionConstructor, returnType: FunctionConstructor) => V) | void;
