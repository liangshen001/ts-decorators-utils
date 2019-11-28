import 'reflect-metadata';
import {MetadataInfo} from "./bean/metadata-info";
import {MakeDecoratorUtil} from "./make-decorator-util";
import {Constructor} from "../dist/lib/bean/constructor";

/**
 * 提供一系列创建 装饰器的工场方法
 * 如果参数为空 小括号必须写 不在支持 不写小括号 '()'
 */
export class DecoratorUtil {
    constructor() {}

    public static getMetadata<V>(metadataInfo: MetadataInfo<V>, target: Object, propertyKey?: string, parameterIndex?: number)
        : (V extends void ? true : V) | undefined {
        if (propertyKey) {
            if (parameterIndex === undefined) {
                return <any> Reflect.getMetadata(metadataInfo.metadataKey, target, propertyKey);
            }
            const key = MakeDecoratorUtil.getParameterPropertyKey(propertyKey, parameterIndex);
            return <any> Reflect.getMetadata(metadataInfo.metadataKey, target, key);
        }
        return <any> Reflect.getMetadata(metadataInfo.metadataKey, target);
    }

    public static getProperties(target: Object): [string, FunctionConstructor][] {
        return MakeDecoratorUtil.classPropertiesMap.get(target) || [];
    }

    public static getMethods(target: Object): [string, FunctionConstructor[], FunctionConstructor][] {
        return MakeDecoratorUtil.classMethodsMap.get(target) || [];
    }
    public static getConstructorParamTypes(target: Object): Constructor[] {
        return Reflect.getMetadata("design:paramtypes", target);
    }
}
