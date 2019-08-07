import {Constructor} from './constructor';

export type ParameterHandler<V, OPA> =
    ((option: OPA, target: Object, propertyKey: string, parameterIndex: number, type: Constructor) => V) | void;
