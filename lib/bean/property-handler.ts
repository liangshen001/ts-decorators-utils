import {Constructor} from './constructor';

export type PropertyHandler<V, OP> = <T>(option: OP, target: Object, propertyKey: string | symbol,
                                         descriptor: TypedPropertyDescriptor<T>, type: Constructor<T>) => V;
