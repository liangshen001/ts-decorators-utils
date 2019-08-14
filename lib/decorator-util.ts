import 'reflect-metadata';
import {MetadataInfo} from "./bean/metadata-info";
import {Constructor} from "./bean/constructor";
import {MakeDecoratorUtil} from "./make-decorator-util";

/**
 * 提供一系列创建 装饰器的工场方法
 * 如果参数为空 小括号必须写 不在支持 不写小括号 '()'
 */
export class DecoratorUtil {

    public static getMetadata<V>(metadataInfo: MetadataInfo<V>, target: Object, propertyKey?: string, parameterIndex?: number)
        : (V extends void ? true : V) | undefined {
        if (propertyKey) {
            if (parameterIndex === undefined) {
                return <any> Reflect.getMetadata(metadataInfo.metadataKey, target, propertyKey);
            }
            const key = MakeDecoratorUtil.getParameterPropertyKey(propertyKey, parameterIndex);
            console.log(metadataInfo.metadataKey);
            return <any> Reflect.getMetadata(metadataInfo.metadataKey, target, key);
        }
        return <any> Reflect.getMetadata(metadataInfo.metadataKey, target);
    }

    public static getProperties(target: Object): [string, Constructor][] {
        return MakeDecoratorUtil.classPropertiesMap.get(target) || [];
    }

    public static getMethods(target: Object): [string, Constructor[], Constructor][] {
        return MakeDecoratorUtil.classMethodsMap.get(target) || [];
    }
}
