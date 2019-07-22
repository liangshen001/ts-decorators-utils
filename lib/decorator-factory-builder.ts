
/**
 * 提供一系列创建 装饰器的工场方法
 * 如果参数为空 小括号必须写 不在支持 不写小括号 '()'
 */
export class DecoratorFactoryBuilder {

    /**
     * 创建方法装饰器 不使用metadata 手动处理方法
     * @param {(option: P, target: Function, propertyKey: string, descriptor) => void} handler
     * @return {(option: P) => MethodDecorator}
     */
    static createMethodDecoratorFactory<O>(
        handler: (option: O, target: Object, propertyKey: string, descriptor) => void):
        (option: O) => MethodDecorator;

    /**
     * 创建方法装饰器 使用metadata 手动处理方法 用来把option转换成metadataValue 数据
     * @param {(option: P, target: Function, propertyKey: string, descriptor) => V} handler
     * @param {symbol} metadataKey
     * @return {(option: P) => MethodDecorator}
     */
    static createMethodDecoratorFactory<O, V>(
        handler: (option: O, target: Object, propertyKey: string, descriptor) => V, metadataKey: symbol):
        (option: O) => MethodDecorator;

    static createMethodDecoratorFactory<O, V = void>(
        handler: (option: O, target: Object, propertyKey: string, descriptor) => V, metadataKey?: symbol):
        (option: O) => MethodDecorator {
        return option =>
            (target: Object, propertyKey: string, descriptor) => {
                const metadataValue = handler(option, target, propertyKey, descriptor);
                if (metadataValue) {
                    Reflect.defineMetadata(metadataKey, metadataValue, target, propertyKey);
                }
            };
    }

    /**
     * 创建属性装饰器工场 不使用metadata
     * @param {(option: O, target: Object, propertyKey: string) => void} handler
     * @return {(option: O) => PropertyDecorator}
     */
    static createPropertyDecoratorFactory<O>(
        handler: (option: O, target: Object, propertyKey: string) => void):
        (option: O) => PropertyDecorator;

    /**
     * 创建属性装饰器工场 使用metadata
     * 属性和方法不一样由于不能得到属性名 所以为类定义一个metadata值为 带有此装饰器的属性集合
     * @param {(option: O, target: Object, propertyKey: string) => V} handler
     * @param {symbol} metadataKey
     * @return {(option: O) => PropertyDecorator}
     */
    static createPropertyDecoratorFactory<O, V>(
        handler: (option: O, target: Object, propertyKey: string) => V, metadataKey: symbol):
        (option: O) => PropertyDecorator

    static createPropertyDecoratorFactory<O, V = void>(
        handler: (option: O, target: Object, propertyKey: string) => V, metadataKey?: symbol):
        (option: O) => PropertyDecorator {
        return option =>
            (target: Object, propertyKey: string) => {
                const value = handler(option, target, propertyKey);
                if (value) {
                    const metadataValue: V[] = Reflect.getOwnMetadata(metadataKey, target, propertyKey) || [];
                    metadataValue.push(value);
                    Reflect.defineMetadata(metadataKey, metadataValue, target);
                }
            };
    }

    /**
     * 创建类装饰器
     * @param {(option: O, target: Function) => void} handler
     * @return {(option: O) => ClassDecorator}
     */
    static createClassDecoratorFactory<O>(handler: (option: O, target: Function) => void):
        (option: O) => ClassDecorator;

    /**
     * 创建类装饰器
     * @param {(option: O, target: Function) => V} handler
     * @param {symbol} metadataKey
     * @return {(option: O) => ClassDecorator}
     */
    static createClassDecoratorFactory<O, V>(
        handler: (option: O, target: Function) => V, metadataKey: symbol):
        (option: O) => ClassDecorator

    static createClassDecoratorFactory<O, V = void>(
        handler: (option: O, target: Function) => V, metadataKey?: symbol):
        (option: O) => ClassDecorator {

        return option =>
                target => {
            const value = handler(option, target);
            if (value) {
                Reflect.defineMetadata(metadataKey, value, target);
            }
        };
    }

    /**
     * 创建方法参数装饰器 为方法定义一个metadata值为 该方法带有此装饰器的参数集合
     * @param {(option: O, target: Object, propertyKey: (string | symbol), parameterIndex: number) => void} handler
     * @return {(option: O) => ParameterDecorator}
     */
    static createParameterDecoratorFactory<O>(
        handler: (option: O, target: Object, propertyKey: string | symbol, parameterIndex: number) => void):
        (option: O) => ParameterDecorator;

    /**
     * 创建方法参数装饰器 为方法定义一个metadata值为 该方法带有此装饰器的参数集合
     * @param {(option: O, target: Object, propertyKey: (string | symbol), parameterIndex: number) => V} handler
     * @param {symbol} metadataKey
     * @return {(option: O) => ParameterDecorator}
     */
    static createParameterDecoratorFactory<O, V>(
        handler: (option: O, target: Object, propertyKey: string | symbol, parameterIndex: number) => V,
        metadataKey: symbol):
        (option: O) => ParameterDecorator;

    static createParameterDecoratorFactory<O, V = void>(
        handler: (option: O, target: Object, propertyKey: string | symbol, parameterIndex: number) => V,
        metadataKey?: symbol):
        (option: O) => ParameterDecorator {
        return option =>
            (target: Function, propertyKey: string | symbol, parameterIndex: number) => {
                const value = handler(option, target, propertyKey, parameterIndex);
                if (value) {
                    const metadataValue: V[] = Reflect.getOwnMetadata(metadataKey, target, propertyKey) || [];
                    metadataValue.push(value);
                    Reflect.defineMetadata(metadataKey, metadataValue, target, propertyKey);
                }
            };
    }

    /**
     * 使用于类或方法上 不使用metadata
     * @param {(option: O, target: Object, propertyKey: (string | symbol), descriptor) => void} methodHandler
     * @param {(option: O, target: Function) => void} classHandler
     * @return {(option: O) => (MethodDecorator & ClassDecorator)}
     */
    static createMethodAndClassDecoratorFactory<O>(
        methodHandler: (option: O, target: Object, propertyKey: string | symbol, descriptor) => void,
        classHandler: (option: O, target: Function) => void): (option: O) => MethodDecorator & ClassDecorator;

    /**
     * 使用于类或方法上 使用metadata
     * @param {(option: O, target: Object, propertyKey: (string | symbol), descriptor) => V} methodHandler
     * @param {(option: O, target: Function) => V} classHandler
     * @param {symbol} metadataKey
     * @return {(option: O) => (MethodDecorator & ClassDecorator)}
     */
    static createMethodAndClassDecoratorFactory<O, V>(
        methodHandler: (option: O, target: Object, propertyKey: string | symbol, descriptor) => V,
        classHandler: (option: O, target: Function) => V,
        metadataKey: symbol): (option: O) => MethodDecorator & ClassDecorator;

    static createMethodAndClassDecoratorFactory<O, V = void>(
        methodHandler: (option: O, target: Object, propertyKey: string | symbol, descriptor) => V,
        classHandler: (option: O, target: Function) => V,
        metadataKey?: symbol): (option: O) => MethodDecorator & ClassDecorator {
        return option =>
            (...args) => {
                if (args.length === 1) {
                    return DecoratorFactoryBuilder.createClassDecoratorFactory<O, V>(
                        classHandler, metadataKey)(option)(args[0]);
                } else if (args.length === 3) {
                    return DecoratorFactoryBuilder.createMethodDecoratorFactory<O, V>(
                        methodHandler, metadataKey)(option)(args[0], args[1], args[2]);
                }
            };
    }
}