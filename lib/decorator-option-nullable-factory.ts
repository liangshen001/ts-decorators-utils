import {DecoratorFactory} from "./decorator-factory";

export class DecoratorOptionNullableFactory {
    static createMethodDecorator<V = any, P = any>(
        metadataKey: symbol, metadataValueConverter: (options: P, target: Function, propertyKey: string | symbol, descriptor) => V):
        MethodDecorator & ((options?: P) => MethodDecorator){
        return <any>((...args) => {
            if ((args[0] && args[0] instanceof Function)) {
                return DecoratorFactory.createMethodDecorator(metadataKey, metadataValueConverter)(null)(args[0], args[1], args[2]);
            }
            return DecoratorFactory.createMethodDecorator(metadataKey, metadataValueConverter)(args[0]);
        });
    }

    static createClassDecorator<V = any, P = any>(
        metadataKey: symbol, metadataValueConverter: (option: P, target: Function) => V):
        ClassDecorator & ((option?: P) => ClassDecorator) {
        return (...args) => {
            // 本身为 Decorator  arg为target
            if (args[0] && args[0] instanceof Function) {
                return DecoratorFactory.createClassDecorator(metadataKey, metadataValueConverter)(null)(args[0]);
            }
            // 返回Decorator
            return DecoratorFactory.createClassDecorator(metadataKey, metadataValueConverter)(args[0]);
        };
    }

    /**
     * 创建属性装饰器 属性和方法不一样由于不能得到属性名 所以为类定义一个metadata值为 带有此装饰器的属性集合
     * @param {symbol} metadataKey
     * @param {(param: P, target: Object, propertyKey: string) => V} metadataValueConverter
     * @return {(option: P) => PropertyDecorator}
     */
    static createPropertyDecorator<V = any, P = any>(
        metadataKey: symbol, metadataValueConverter: (option: P, target: Object, propertyKey: string) => V):
        ((option?: P) => PropertyDecorator) & PropertyDecorator {
        return <any>((...args) => {
            // 本身为 Decorator  arg为target
            if (args[0] && args[0] instanceof Function) {
                return DecoratorFactory.createPropertyDecorator<V, P>(metadataKey, metadataValueConverter)(null)(args[0], args[1]);
            }
            // 返回Decorator
            return DecoratorFactory.createPropertyDecorator<V, P>(metadataKey, metadataValueConverter)(args[0]);
        });
            // option =>
            // (target: Object, propertyKey: string) => {
            //     const metadataValue: V[] = Reflect.getOwnMetadata(metadataKey, target, propertyKey) || [];
            //     metadataValue.push(metadataValueConverter(option, target, propertyKey));
            //     Reflect.defineMetadata(metadataKey, metadataValue, target);
            // };
    }

    /**
     * 创建方法参数装饰器 为方法定义一个metadata值为 该方法带有此装饰器的参数集合
     * @param {symbol} metadataKey
     * @param {(option: P, target: Object, propertyKey: (string | symbol), parameterIndex: number) => V} metadataValueConverter
     * @return {(option: P) => ParameterDecorator}
     */
    static createParameterDecorator<V = any, P = any>(
        metadataKey: symbol, metadataValueConverter: (option: P, target: Object, propertyKey: string | symbol, parameterIndex: number) => V):
        ParameterDecorator & ((option?: P) => ParameterDecorator) {
        return <any> ((...args) => {
            if (args[0] && args[0] instanceof Function) {
                return DecoratorFactory.createParameterDecorator(metadataKey, metadataValueConverter)(null)(args[0], args[1], args[2])
            }
            return DecoratorFactory.createParameterDecorator(metadataKey, metadataValueConverter)(args[0]);
        });
    }

    static createMethodAndClassDecorator<V = any, P = any>(
        metadataKey: symbol, metadataValueMethodConverter: (option: P, target: Object, propertyKey: string | symbol, descriptor) => V,
        metadataValueClassConverter: (option: P, target: Function) => V):
        ((option?: P) => MethodDecorator & ClassDecorator) & MethodDecorator & ClassDecorator {
        return (...args) => {
            if (args[0] && args[0] instanceof Function || args.length === 3) {
                if (args.length === 1) {
                    return DecoratorOptionNullableFactory.createClassDecorator<V, P>(metadataKey, metadataValueClassConverter)(null)(args[0]);
                } else if (args.length === 3) {
                    return DecoratorOptionNullableFactory.createMethodDecorator<V, P>(metadataKey, metadataValueMethodConverter)(null)(args[0], args[1], args[2]);
                }
            }
            return DecoratorFactory.createMethodAndClassDecorator<V, P>(metadataKey, metadataValueMethodConverter, metadataValueClassConverter)(args[0])
        };
    }

    /**
     * 相当于 回调函数定义 行为  去柯里化 （去柯里应用）
     * @param {(option, target) => void} callback
     * @return {(option: P) => ClassDecorator}
     */
    static createCustomClassDecorator<P>(callback: (option: P | null, target: Function) => void):
        (option?: P) => ClassDecorator & ClassDecorator {
        return (...args) => {
            if (args[0] && args[0] instanceof Function) {
                return DecoratorFactory.createCustomClassDecorator<P>(callback)(null)(args[0])
            }
            return DecoratorFactory.createCustomClassDecorator<P>(callback)(args[0]);
        }

            // option => target => callback(option, target);
    }
}