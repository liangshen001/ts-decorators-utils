import 'reflect-metadata';

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
        handler: <T>(option: O, target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<T>) => V,
        metadataKey?: symbol | string): (option: O) => MethodDecorator {
        return option =>
            (target, propertyKey, descriptor) => {
                const metadataValue = handler(option, target, propertyKey, descriptor);
                if (metadataKey) {
                    if (metadataValue) {
                        Reflect.defineMetadata(metadataKey, metadataValue, target, propertyKey);
                    } else {
                        Reflect.defineMetadata(metadataKey, true, target, propertyKey);
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
        handler: (option: O, target: Object, propertyKey: string | symbol) => V, metadataKey?: symbol | string):
        (option: O) => PropertyDecorator {
        return option =>
            (target, propertyKey) => {
                const metadataValue = handler(option, target, propertyKey);
                if (metadataKey) {
                    if (metadataValue) {
                        Reflect.defineMetadata(metadataKey, metadataValue, target, propertyKey);
                    } else {
                        Reflect.defineMetadata(metadataKey, true, target, propertyKey);
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
        handler: <TFunction extends Function>(option: O, target: TFunction) => V, metadataKey?: symbol | string):
        (option: O) => ClassDecorator {
        return option =>
            <TFunction extends Function>(target: TFunction) => {
                const metadataValue = handler(option, target);
                if (metadataKey) {
                    if (metadataValue) {
                        Reflect.defineMetadata(metadataKey, metadataValue, target);
                    } else {
                        Reflect.defineMetadata(metadataKey, true, target);
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
        handler: (option: O, target: Object, propertyKey: string | symbol, parameterIndex: number) => V,
        metadataKey?: symbol | string):
        (option: O) => ParameterDecorator {
        return option =>
            (target: Function, propertyKey: string | symbol, parameterIndex: number) => {
                const value = handler(option, target, propertyKey, parameterIndex);
                if (metadataKey) {
                    if (value) {
                        const metadataValue: V[] = Reflect.getOwnMetadata(metadataKey, target, propertyKey) || [];
                        metadataValue.push(value);
                        Reflect.defineMetadata(metadataKey, metadataValue, target, propertyKey);
                    } else {
                        const metadataValue: number[] = Reflect.getOwnMetadata(metadataKey, target, propertyKey) || [];
                        metadataValue.push(parameterIndex);
                        Reflect.defineMetadata(metadataKey, metadataValue, target, propertyKey);
                    }
                }
            };
    }

    public static makePropertyAndMethodDecorator<OP, OM, V = void>(
        propertyHandler: (option: OP, target: Object, propertyKey: string | symbol) => V,
        methodHandler: <T>(option: OM, target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<T>) => V,
        metadataKey?: symbol | string
    ): ((option: OP) => PropertyDecorator) & ((option: OM) => MethodDecorator) {
        return option =>
            (...args) => {
                if (args.length === 2) {
                    return <any> DecoratorUtil.makePropertyDecorator<OP, V>(
                        propertyHandler, metadataKey)(option)(args[0], args[1]);
                } else if (args.length === 3) {
                    return DecoratorUtil.makeMethodDecorator<OM, V>(
                        methodHandler, metadataKey)(option)(args[0], args[1], args[2]);
                }
            }
    }

    /**
     * 使用于类或方法上
     * @param {<T>(option: OM, target: Object, propertyKey: (string | symbol), descriptor: TypedPropertyDescriptor<T>) => V} methodHandler
     * @param {<TFunction extends Function>(option: OC, target: TFunction) => V} classHandler
     * @param {symbol | string} metadataKey
     * @return {((option: OM) => MethodDecorator) & ((option: OC) => ClassDecorator)}
     */

    public static makeMethodAndClassDecorator<OM, OC, V = void>(
        methodHandler: <T>(option: OM, target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<T>) => V,
        classHandler: <TFunction extends Function>(option: OC, target: TFunction) => V,
        metadataKey?: symbol | string
    ): ((option: OM) => MethodDecorator) & ((option: OC) => ClassDecorator) {
        return option =>
            (...args) => {
                if (args.length === 1) {
                    return <any> DecoratorUtil.makeClassDecorator<OC, V>(
                        classHandler, metadataKey)(option)(args[0]);
                } else if (args.length === 3) {
                    return <any> DecoratorUtil.makeMethodDecorator<OM, V>(
                        methodHandler, metadataKey)(option)(args[0], args[1], args[2]);
                }
            };
    }

    public static a() {
        return 0;
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
        parameterHandler?: (option: OPA, target: Object, propertyKey: string | symbol, parameterIndex: number) => V,
        propertyHandler?: (option: OP, target: Object, propertyKey: string | symbol) => V,
        methodHandler?: <T>(option: OM, target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<T>) => V,
        classHandler?: <TFunction extends Function>(option: OC, target: TFunction) => V,
        metadataKey?: symbol | string
    ): ((option: OPA) => ParameterDecorator) & ((option: OP) => PropertyDecorator)
        & ((option: OM) => MethodDecorator) & ((option: OC) => ClassDecorator) {
        return option =>
            (...args) => {
                // args 参数为装饰器 回调参数 不同种类的装饰器有不同的参数
                if (args.length === 1) {
                    // 处理类装饰器
                    return classHandler && DecoratorUtil.makeClassDecorator<OC, V>(
                        classHandler, metadataKey)(option)(args[0]);
                } else if (args.length === 2) {
                    // 外理属性装饰器
                    return propertyHandler && DecoratorUtil.makePropertyDecorator<OP, V>(
                        propertyHandler, metadataKey)(option)(args[0], args[1]);
                } else if (args.length === 3) {
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
            };
    }
}


