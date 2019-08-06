import {Constructor} from './constructor';

export type ClassHandler<V, OC> = (<TFunction extends Function>(option: OC, target: TFunction, paramTypes: Constructor[]) => V) | void;
