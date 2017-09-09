export function Prop(propertyName?: string): PropertyDecorator {
    return function (target: Object, propertyKey: string) {
        const normalizedPropName = propertyName || propertyKey;

        function getter() {
            return this.props[normalizedPropName];
        }

        function setter(value: any) {
            this.props[normalizedPropName] = value;
        }

        Object.defineProperty(target, propertyKey, {
            get: getter,
            set: setter,
            enumerable: true,
            configurable: true
        });
    };
}
