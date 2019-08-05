import 'reflect-metadata';
import {MetadataKey} from './bean/metadata-key';
import {Constructor} from './bean/constructor';
import {ParameterHandler} from './bean/parameter-handler';
import {PropertyHandler} from './bean/property-handler';
import {MethodHandler} from './bean/method-handler';
import {ClassHandler} from './bean/class-handler';
import {MetadataInfo} from "./bean/metadata-info";

/**
 * 提供一系列创建 装饰器的工场方法
 * 如果参数为空 小括号必须写 不在支持 不写小括号 '()'
 */
export class DecoratorUtil {

    /**
     * 创建方法装饰器
     * @param {<T>(option: O, target: Object, propertyKey: (string | symbol), descriptor: TypedPropertyDescriptor<T>) => V} handler
     * @param {symbol | string} metadataKey
     * @return {(option: O) => MethodDecorator}
     */

    public static makeMethodDecorator<O, V = void>(
        handler: MethodHandler<V, O>,
        metadataKey?: string | symbol): (option: O) => MethodDecorator {
        return option =>
            (target, propertyKey, descriptor) => {
                const paramtypes = Reflect.getMetadata('design:paramtypes', target, propertyKey);
                const returntype = Reflect.getMetadata('design:returntype', target, propertyKey);
                const metadataValue = handler(option, target, propertyKey, descriptor, paramtypes, returntype);
                if (metadataKey) {
                    if (metadataValue === undefined) {
                        Reflect.defineMetadata(metadataKey, true, target, propertyKey);
                    } else {
                        Reflect.defineMetadata(metadataKey, metadataValue, target, propertyKey);
                    }
                }
                return descriptor;
            };
    }

    /**
     * 创建属性装饰器工场 不使用metadata
     * @param {(option: O, target: Object, propertyKey: (string | symbol)) => V} handler
     * @param {symbol | string} metadataKey
     * @return {(option: O) => PropertyDecorator}
     */

    public static makePropertyDecorator<O, V = void>(
        handler: PropertyHandler<V, O>,
        metadataKey?: string | symbol
    ): (option: O) => PropertyDecorator {
        return option =>
            (target, propertyKey) => {
                const type = Reflect.getMetadata('design:type', target, propertyKey);
                const metadataValue = handler(option, target, propertyKey, type);
                if (metadataKey) {
                    if (metadataValue === undefined) {
                        Reflect.defineMetadata(metadataKey, true, target, propertyKey);
                    } else {
                        Reflect.defineMetadata(metadataKey, metadataValue, target, propertyKey);
                    }
                }
            };
    }

    /**
     * 创建类装饰器
     * @param {<TFunction extends Function>(option: O, target: TFunction) => V} handler
     * @param {symbol | string} metadataKey
     * @return {(option: O) => ClassDecorator}
     */

    public static makeClassDecorator<O, V = void>(
        handler: ClassHandler<V, O>,
        metadataKey?: string | symbol):
        (option: O) => ClassDecorator {
        return option =>
            <TFunction extends Function>(target: TFunction) => {
                const paramtypes = Reflect.getMetadata('design:paramtypes', target);
                const metadataValue = handler(option, target, paramtypes);
                if (metadataKey) {
                    if (metadataValue === undefined) {
                        Reflect.defineMetadata(metadataKey, true, target);
                    } else {
                        Reflect.defineMetadata(metadataKey, metadataValue, target);
                    }
                }
                return target;
            };
    }

    /**
     * 创建方法参数装饰器 为方法定义一个metadata值为 该方法带有此装饰器的参数集合
     * @param {(option: O, target: Object, propertyKey: (string | symbol), parameterIndex: number) => V} handler
     * @param {symbol | string} metadataKey
     * @return {(option: O) => ParameterDecorator}
     */

    public static makeParameterDecorator<O, V = void>(
        handler: ParameterHandler<V, O>,
        metadataKey?: string | symbol
    ): (option: O) => ParameterDecorator {
        return option =>
            (target: Function, propertyKey: string, parameterIndex: number) => {
                const paramtypes = Reflect.getMetadata('design:paramtypes', target, propertyKey);
                const value = handler(option, target, propertyKey, parameterIndex, paramtypes[parameterIndex]);
                if (metadataKey) {
                    const key = DecoratorUtil._getParameterPropertyKey(propertyKey, parameterIndex);
                    if (value === undefined) {
                        Reflect.defineMetadata(metadataKey, true, target, key);
                    } else {
                        Reflect.defineMetadata(metadataKey, value, target, key);
                    }
                }
            };
    }

    /**
     * 创建 可用于所有'目标'(方法参数，属性，方法，类)上的装饰器
     * @param parameterHandler
     * @param propertyHandler
     * @param methodHandler
     * @param classHandler
     * @param metadataKey
     */
    public static makeParameterAndPropertyAndMethodAndClassDecorator<OPA, OP, OM, OC, V = void>(
        parameterHandler?: ParameterHandler<V, OPA>,
        propertyHandler?: PropertyHandler<V, OP>,
        methodHandler?: MethodHandler<V, OM>,
        classHandler?: ClassHandler<V, OC>,
        metadataKey?: string | symbol
    ): any {
        const factory = option =>
            (...args) => {
                // args 参数为装饰器 回调参数 不同种类的装饰器有不同的参数
                if (args.length === 1) {
                    // 处理类装饰器
                    return classHandler && DecoratorUtil.makeClassDecorator<OC, V>(
                        classHandler, metadataKey)(option)(args[0]);
                } else if (args.length === 3) {
                    if (args[2] === undefined) {
                        // 外理属性装饰器
                        return propertyHandler && DecoratorUtil.makePropertyDecorator<OP, V>(
                            propertyHandler, metadataKey)(option)(args[0], args[1]);
                    } else {
                        if (typeof args[2] === 'number') {
                            // 处理参数装饰器
                            return parameterHandler && DecoratorUtil.makeParameterDecorator<OPA, V>(
                                parameterHandler, metadataKey)(option)(args[0], args[1], args[2]);
                        } else {
                            // 处理方法装饰器
                            return methodHandler && DecoratorUtil.makeMethodDecorator<OM, V>(
                                methodHandler, metadataKey)(option)(args[0], args[1], args[2]);
                        }
                    }
                }
            };
        factory.metadataKey = metadataKey;
        return factory;
    }

    public static getMetadata<V>(metadataInfo: MetadataInfo<V>, target: Object, propertyKey?: string, parameterIndex?: number)
        : (V extends void ? true : V) | undefined {
        if (propertyKey) {
            if (parameterIndex === undefined) {
                return <any> Reflect.getMetadata(metadataInfo.metadataKey, target, propertyKey);
            }
            const key = DecoratorUtil._getParameterPropertyKey(propertyKey, parameterIndex);
            return <any> Reflect.getMetadata(metadataInfo.metadataKey, target, key);
        }
        return <any> Reflect.getMetadata(metadataInfo.metadataKey, target);
    }

    private static _getParameterPropertyKey(propertyKey: string, parameterIndex: number) {
        return `${propertyKey}&${parameterIndex}`;
    }
}


