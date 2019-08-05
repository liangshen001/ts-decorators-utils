import {Constructor} from './constructor';

export type PropertyHandler<V, OP> = <T>(option: OP, target: Object, propertyKey: string | symbol, type: Constructor<T>) => V;
