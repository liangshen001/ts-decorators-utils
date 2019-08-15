import {DecoratorFactory} from "./decorator-factory";

export type MetadataInfo<V> = {
    metadataKey: symbol;
    // 为了保存类型 实际为空
    __metadataValueType: V;
} & DecoratorFactory;
