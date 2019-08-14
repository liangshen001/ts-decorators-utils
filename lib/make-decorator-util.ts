import {MethodHandler} from "./bean/method-handler";
import {PropertyHandler} from "./bean/property-handler";
import {ClassHandler} from "./bean/class-handler";
import {ParameterHandler} from "./bean/parameter-handler";
import {Constructor} from "./bean/constructor";

export class MakeDecoratorUtil {
    public static classPropertiesMap = new Map<Object, [string, Constructor][]>();
    public static classMethodsMap = new Map<Object, [string, Constructor[], Constructor][]>();

    public static getParameterPropertyKey(propertyKey: string, parameterIndex: number) {
        return `${propertyKey}&${parameterIndex}`;
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
                    return MakeDecoratorUtil.makeClassDecorator<OC, V>(
                        classHandler, metadataKey)(option)(args[0]);
                } else if (args.length === 3) {
                    if (args[2] === undefined) {
                        // 外理属性装饰器
                        return MakeDecoratorUtil.makePropertyDecorator<OP, V>(
                            propertyHandler, metadataKey)(option)(args[0], args[1]);
                    } else {
                        if (typeof args[2] === 'number') {
                            // 处理参数装饰器
                            return MakeDecoratorUtil.makeParameterDecorator<OPA, V>(
                                parameterHandler, metadataKey)(option)(args[0], args[1], args[2]);
                        } else {
                            // 处理方法装饰器
                            return MakeDecoratorUtil.makeMethodDecorator<OM, V>(
                                methodHandler, metadataKey)(option)(args[0], args[1], args[2]);
                        }
                    }
                }
            };
        factory.metadataKey = metadataKey;
        return factory;
    }
    /**
     * 创建方法装饰器
     * @param {<T>(option: O, target: Object, propertyKey: (string | symbol), descriptor: TypedPropertyDescriptor<T>) => V} handler
     * @param {symbol | string} metadataKey
     * @return {(option: O) => MethodDecorator}
     */

    private static makeMethodDecorator<O, V = void>(
        handler: MethodHandler<V, O>,
        metadataKey?: string | symbol): (option: O) => MethodDecorator {
        return option =>
            (target, propertyKey, descriptor) => {
                const paramtypes = Reflect.getMetadata('design:paramtypes', target, propertyKey);
                const returntype = Reflect.getMetadata('design:returntype', target, propertyKey);

                const _classMethodsMap = MakeDecoratorUtil.classMethodsMap;
                let properties;
                if (_classMethodsMap.has(target)) {
                    properties = _classMethodsMap.get(target);
                } else {
                    properties = [];
                    _classMethodsMap.set(target, properties);
                }
                const currentProperty = properties.find(([key]) => key === propertyKey);
                if (!currentProperty) {
                    properties.push([propertyKey, paramtypes, returntype]);
                }

                let metadataValue;
                if (handler) {
                    metadataValue = (<any>handler)(option, target, propertyKey, descriptor, paramtypes, returntype);
                    if (metadataValue === undefined) {
                        metadataValue = true;
                    }
                } else {
                    metadataValue = option || true;
                }
                Reflect.defineMetadata(metadataKey, metadataValue, target, propertyKey);
                return descriptor;
            };
    }

    /**
     * 创建属性装饰器工场 不使用metadata
     * @param {(option: O, target: Object, propertyKey: (string | symbol)) => V} handler
     * @param {symbol | string} metadataKey
     * @return {(option: O) => PropertyDecorator}
     */

    private static makePropertyDecorator<O, V = void>(
        handler?: PropertyHandler<V, O>,
        metadataKey?: string | symbol
    ): (option: O) => PropertyDecorator {
        return option =>
            (target, propertyKey) => {
                const type = Reflect.getMetadata('design:type', target, propertyKey);
                /***************************************处理 设置_classPropertiesMap****************************************/
                const propertiesMap = MakeDecoratorUtil.classPropertiesMap;
                let properties;
                if (propertiesMap.has(target)) {
                    properties = propertiesMap.get(target);
                } else {
                    properties = [];
                    propertiesMap.set(target, properties);
                }
                const currentProperty = properties.find(([key]) => key === propertyKey);
                if (!currentProperty) {
                    properties.push([propertyKey, type]);
                }
                /***************************************************************************************************/
                let metadataValue;
                if (handler) {
                    metadataValue = (<any> handler)(option, target, propertyKey, type);
                    if (metadataValue === undefined) {
                        metadataValue = true;
                    }
                } else {
                    metadataValue = option || true;
                }
                Reflect.defineMetadata(metadataKey, metadataValue, target, propertyKey);
            };
    }

    /**
     * 创建类装饰器
     * @param {<TFunction extends Function>(option: O, target: TFunction) => V} handler
     * @param {symbol | string} metadataKey
     * @return {(option: O) => ClassDecorator}
     */

    private static makeClassDecorator<O, V = void>(
        handler?: ClassHandler<V, O>,
        metadataKey?: string | symbol):
        (option: O) => ClassDecorator {
        return option =>
            <TFunction extends Function>(target: TFunction) => {
                const paramtypes = Reflect.getMetadata('design:paramtypes', target);
                let metadataValue;
                if (handler) {
                    metadataValue = (<any>handler)(option, target, paramtypes);
                    if (metadataValue === undefined) {
                        metadataValue = true;
                    }
                } else {
                    metadataValue = option || true;
                }
                Reflect.defineMetadata(metadataKey, metadataValue, target);
                return target;
            };
    }

    /**
     * 创建方法参数装饰器 为方法定义一个metadata值为 该方法带有此装饰器的参数集合
     * @param {(option: O, target: Object, propertyKey: (string | symbol), parameterIndex: number) => V} handler
     * @param {symbol | string} metadataKey
     * @return {(option: O) => ParameterDecorator}
     */

    private static makeParameterDecorator<O, V = void>(
        handler?: ParameterHandler<V, O>,
        metadataKey?: string | symbol
    ): (option: O) => ParameterDecorator {
        return option =>
            (target: Function, propertyKey: string, parameterIndex: number) => {
                const paramtypes = Reflect.getMetadata('design:paramtypes', target, propertyKey);
                const key = MakeDecoratorUtil.getParameterPropertyKey(propertyKey, parameterIndex);
                let metadataValue;
                if (handler) {
                    metadataValue = (<any>handler)(option, target, propertyKey, parameterIndex, paramtypes[parameterIndex]);
                    if (metadataValue === undefined) {
                        metadataValue = true;
                    }
                } else {
                    metadataValue = option || true;
                }
                Reflect.defineMetadata(metadataKey, metadataValue, target, key);
            };
    }
}
