# typescript中装饰器声明

会对声明的装饰器 使用reflect metadata来保存参数信息（这个过程是自定义的 下面会讲），以便装饰器的解析

## 使用案例

[@node-mvc-decorator/core](https://github.com/node-mvc-decorator/core#readme) 
声明一套spring mvc注解风格的装饰器

以@RequestMapping为例子

首先这个这个装饰器可以不带参数， 在不带参数的同时括号也不带， 可以使用string类型的参数 可以使用对象参数

```typescript
@RequestMapping
class A {}

@RequestMapping()
class B {}

@RequestMapping('/test')
class C {}

// 注意下面使用方式和java注解参数书写方式不一样了 但是大同小异 装饰器没法完全实现java注解的那种形式
@RequestMapping({path: '/test1', params: 'param1=1'})
class D {}

@RequestMapping({path: ['/test1', '/test3'], params: ['a', 'b']})
class D {}
``` 

可以注意到后俩种方式 参数path和params 可以为string也可以为string[]类型

上面的这些写法完全可以写在方法上

## @RequestMapping装饰器在@node-mvc-decorator/core中是如何声明的

使用这个工具很简单

这里使用reflect-metadata来做装饰器的解析


### 装饰器的声明 （四步）

#### 一、定义一个metadataKey 在解析的时候也会使用到 为了不发生冲突我使用Symbol类型来声明

```typescript
const REQUEST_MAPPING_METADATA_KEY = Symbol('REQUEST_MAPPING_METADATA_KEY');
```

### 二、因为@RequestMapping可以使用参数所以 定义一个参数类型，这里还可以直接使用spring类型 和spring mvc一致
```typescript
type RequestMappingParam = {
    method: RequestMethod[] | RequestMethod;
    path: string[] | string;
    params?: string[] | string;
    headers?: string[] | string;
    consumes?: string[] | string;
    produces?: string[] | string;
} | string;
```

### 三、因为使用reflect metadata来解析，所以要声明一个metadata value的类型

```typescript
type RequestMappingValue = {
    path: string[];
    method: RequestMethod[];
    // ['a', '!b', 'c=4', 'b!=4']
    params: string[];
    headers: string[];
    // content-Type application/json、text/html
    consumes: string[];
    produces: string[];
}
```
为什么不直接保存RequestMappingParam类型的数据那？还需要转化成RequestMappingValue类型的数据？因为我在实际应用中发现在声明的时候就所参数解析成以后使用类型的数据是很好的作法

不需要每次使用metadata value的时候都做解析 只需要声明的时候解析一次

### 四、最后一步，创建装饰器

```typescript
const metadataValueConverter = (param) => {
    const defaultMethod = [RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE];
    
    const defaultValue = {
        method: defaultMethod,
        path: [''],
        params: [],
        headers: [],
        consumes: [],
        produces: []
    };
    if (param) {
        if (typeof param === 'string') {
            return {
                ...defaultValue,
                path: [param]
            };
        } else {
            return {
                ...defaultValue,
                method: getArrayValue(param.method, defaultMethod),//getArrayValue(param.method, ),
                path: getArrayValue(param.path),
                params: getArrayValue(param.params),
                headers: getArrayValue(param.headers),
                consumes: getArrayValue(param.consumes),
                produces: getArrayValue(param.produces)
            };
        }
    }
    return {...defaultValue};
};


const RequestMapping = methodAndClassDecoratorFactoryBuilderOptionsEmptiable<RequestMappingParam,
    RequestMappingValue, RequestMappingValue>(
    REQUEST_MAPPING_METADATA_KEY, metadataValueConverter, metadataValueConverter
);
```

主要方法 methodAndClassDecoratorFactoryBuilderOptionsEmptiable 意思是
可以创建一个 '参数可为空的' '同时在方法和类上引用的' 装饰器

* 参数可为空的 工具方法中带有OptionsEmptiable的方法，是说: @RequestMapping @RequestMapping() 这俩个参数都为空
* 同时在方法和类上引用的 这很好理解 可以使用在类上和方法上 使用方法 完全一样

methodAndClassDecoratorFactoryBuilderOptionsEmptiable方法有三个泛型参数
* 第一个泛型参数为 第二步中声明的类型（RequestMappingParam）
* 第二个泛型参数为 方法metadata中存放的类型 第三步中声明的类型（RequestMappingValue）保存在metadata中的类型
* 第二个泛型参数为 类metadata中存放的类型 第三步中声明的类型（RequestMappingValue）保存在metadata中的类型 （这里在方法上和在类上处理方法是一样的）

methodAndClassDecoratorFactoryBuilderOptionsEmptiable方法有三个参数
* 第一个参数为 第一步中声明的metadata key变量：REQUEST_MAPPING_METADATA_KEY 
* 第二个参数为 回调函数 方法中 参数类型和metadata中类型数据的转换 metadataValueConverter
* 第二个参数为 回调函数 类中 参数类型和metadata中类型数据的转换 metadataValueConverter （这里方法和类的处理一样）



## 装饰器的解析

假如有这么个类中使用和装饰器

```typescript
@RequestMapping({path: ['/A', '/AA', '/AAA']})
class A {
    @RequestMapping
    test() {}
}
```

解析类中的装饰器

```typescript
// 可以返回RequestMappingValue类型的数据 注意如果 A类中没有使用RequestMapping 这里的rootRequestMappingValue为null
// 类中第二个参数需要使用类的constructor
const rootRequestMappingValue: RequestMappingValue = Reflect.getMetadata(REQUEST_MAPPING_METADATA_KEY, A);
```

解析方法中的装饰器

```typescript
// 如果test方法没有这个装饰器 则返回null
// 方法中第二个参数需要使用类的prototype
const requestMappingValue: RequestMappingValue =
                Reflect.getMetadata(REQUEST_MAPPING_METADATA_KEY, constructor.prototype, 'test');

```

## api

请使用 DecoratorFactory 和 DecoratorOptionNullableFactory 中的方法

