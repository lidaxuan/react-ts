/**
 * @file loading 装饰器
 * @author svon.me@gmail.com
 */

import _ from 'lodash';

const autoLoadingName = 'loading';

export function Fun(loadingName: string = autoLoadingName) {
  return function(target: any, methodName: string, descriptor: PropertyDescriptor) {
    const fun = descriptor.value;
    descriptor.value = function(...args: any[]) {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const self: any = this;
      const callback = async function() {
        let data: any = void 0;
        try {
          data = await fun.apply(self, args);
        } catch (error) {
          // error
        }
        return new Promise(resolve => {
          const end = {};
          end[loadingName] = false;
          self.setState(end, () => {
            resolve(data);
          });
        });
      };
      return new Promise(resolve => {
        const start = {};
        start[loadingName] = true;
        self.setState(start, () => {
          const data = Promise.resolve(callback());
          resolve(data);
        });
      });
    };
  };
}

export function Class(loadingName: string = autoLoadingName) {
  return function(target: any): any {
    return class extends target {
      constructor(...args: any[]) {
        super(...args);
        if (!this.state) {
          this.state = {};
        }
        this.state[loadingName] = false;
      }
      getLoadingValue(): boolean {
        const value = this.state[loadingName];
        return !!value;
      }
    };
  };
}
// 获取 loading value
export function getLoadingValue(target: any) {
  if (target && target.getLoadingValue) {
    if (_.isFunction(target.getLoadingValue)) {
      try {
        return target.getLoadingValue();
      } catch (error) {
        return false;
      }
    }
  }
  return false;
}
