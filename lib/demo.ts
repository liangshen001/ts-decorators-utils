import {DecoratorFactoryBuilder} from './decorator-factory/decorator-factory-builder';
import {MetadataKey} from './bean/metadata-key';
import {Constructor} from './bean/constructor';
import {DecoratorUtil} from "./decorator-util";
import {MetadataInfo} from "./bean/metadata-info";


type ValueOption = {
    a: string;
}

type MetadataValue = {
    test: string;
}


const AssertTrue = DecoratorFactoryBuilder
    .create<void>('metadataKey')
    .property(() => {}).build();


class Demo {
    @AssertTrue()
    public a: string;
}

console.log(AssertTrue.metadataKey);
let metadata = DecoratorUtil.getMetadata(AssertTrue, Demo);
console.log(metadata);

