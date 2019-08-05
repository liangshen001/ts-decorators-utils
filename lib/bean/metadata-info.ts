export type MetadataInfo<V> = {
    metadataKey: string | symbol;
    // 为了保存类型 实际为空
    __metadataValueType: V;
}