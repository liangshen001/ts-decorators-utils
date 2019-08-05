import {Constructor} from './constructor';

export type PropertyHandler<V, OP> = (option: OP, target: Object, propertyKey: string | symbol, type: Constructor<any>) => V;
