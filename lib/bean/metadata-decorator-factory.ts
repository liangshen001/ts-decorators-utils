import {MetadataInfo} from "./metadata-info";

export type MetadataDecoratorFactory<RESOURCE, V> = RESOURCE & MetadataInfo<V>;
