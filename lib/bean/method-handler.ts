import {Constructor} from './constructor';

export type MethodHandler<V, OM> = (<T>(option: OM, target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<T>,
                                        paramTypes: Constructor, returnType: Constructor) => V) | void;
