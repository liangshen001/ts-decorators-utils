/**
 * @deprecated
 * @see DecoratorFactoryBuilder
 */
export class DecoratorFactory {

    /**
     * 创建方法装饰器 直接在方法定义一个metadata
     * @param {symbol} metadataKey
     * @param {(options: P, target: Function, propertyKey: string, descriptor) => V} metadataValueConverter
     * @return {(option: P) => MethodDecorator}
     */
    static createMethodDecorator<V = any, P = any>(
        metadataKey: symbol,metadataValueConverter: (option: P, target: Function, propertyKey: string, descriptor) => V):
        (option: P) => MethodDecorator {
        return option =>
            (target: Function, propertyKey: string, descriptor) =>
                Reflect.defineMetadata(metadataKey, metadataValueConverter(
                    option, target, propertyKey, descriptor), target, propertyKey);
    }

    /**
     * 创建属性装饰器 属性和方法不一样由于不能得到属性名 所以为类定义一个metadata值为 带有此装饰器的属性集合
     * @param {symbol} metadataKey
     * @param {(param: P, target: Object, propertyKey: string) => V} metadataValueConverter
     * @return {(option: P) => PropertyDecorator}
     */
    static createPropertyDecorator<V = any, P = any>(
        metadataKey: symbol, metadataValueConverter: (option: P, target: Object, propertyKey: string) => V):
        (option: P) => PropertyDecorator {
        return option =>
            (target: Object, propertyKey: string) => {
                const metadataValue: V[] = Reflect.getOwnMetadata(metadataKey, target, propertyKey) || [];
                metadataValue.push(metadataValueConverter(option, target, propertyKey));
                Reflect.defineMetadata(metadataKey, metadataValue, target);
            };
    }

    /**
     * 创建类装饰器
     * @param {symbol} metadataKey
     * @param {(option: P, target: Function) => V} metadataValueConverter
     * @return {(option: P) => ClassDecorator}
     */
    static createClassDecorator<V = any, P = any>(
        metadataKey: symbol, metadataValueConverter: (option: P, target: Function) => V):
        (option: P) => ClassDecorator {
        return DecoratorFactory.createCustomClassDecorator<P>((option, target) =>
            Reflect.defineMetadata(metadataKey, metadataValueConverter(option, target), target));

        // (option: P): ClassDecorator =>
        //     target =>
        //         Reflect.defineMetadata(metadataKey, metadataValueConverter(option, target), target);
    }

    /**
     * 创建方法参数装饰器 为方法定义一个metadata值为 该方法带有此装饰器的参数集合
     * @param {symbol} metadataKey
     * @param {(option: P, target: Object, propertyKey: (string | symbol), parameterIndex: number) => V} metadataValueConverter
     * @return {(option: P) => ParameterDecorator}
     */
    static createParameterDecorator<V = any, P = any>(
        metadataKey: symbol, metadataValueConverter: (option: P, target: Object, propertyKey: string | symbol, parameterIndex: number) => V):
        (option: P) => ParameterDecorator {
        return option =>
            (target: Function, propertyKey: string | symbol, parameterIndex: number) => {
                const metadataValue: V[] = Reflect.getOwnMetadata(metadataKey, target, propertyKey) || [];
                metadataValue.push(metadataValueConverter(option, target, propertyKey, parameterIndex));
                Reflect.defineMetadata(metadataKey, metadataValue, target, propertyKey);
            };
    }

    static createMethodAndClassDecorator<V = any, P = any>(
        metadataKey: symbol, metadataValueMethodConverter: (option: P, target: Object, propertyKey: string | symbol, descriptor) => V,
        metadataValueClassConverter: (option: P, target: Function) => V): (option: P) => MethodDecorator & ClassDecorator {
        return option =>
            (...args) => {
                if (args.length === 1) {
                    return DecoratorFactory.createClassDecorator<V, P>(metadataKey, metadataValueClassConverter)(option)(args[0]);
                } else if (args.length === 3) {
                    return DecoratorFactory.createMethodDecorator<V, P>(metadataKey, metadataValueMethodConverter)(option)(args[0], args[1], args[2]);
                }
            };
    }

    /**
     * 相当于 回调函数定义 行为  去柯里化 （去柯里应用）
     * @param {(option, target) => void} callback
     * @return {(option: P) => ClassDecorator}
     */
    static createCustomClassDecorator<P>(callback: (option: P | null, target: Function) => void):
        (option: P) => ClassDecorator {
        return option => target => callback(option, target);
    }
}