/**
 * @file 提示语处理
 * @param message 默认提示信息
 * @author svon.me@gmail.com
 */

import * as Antd from 'antd';
import safeGet from '@fengqiaogang/safe-get';

/*
import Message from 'src/utils/decorators/message';

class demo {
  @Message() // 监听异常
  async getList(): Promise<void> {
    const query = {};
    const data = await api(query);
    console.log(data);
  }
}
*/


/*
import Message from 'src/utils/decorators/message';

class demo {
  @Message()
  async getList(): Promise<void> {
    const query = {};
    try {
      const data = await api(query);
      console.log(data);
    } catch (error) {
      // todo
      return Promise.reject(error); // 将异常抛给 @Message 装饰器
    }
  }
}
*/

/**
 * @param message 默认提示内容
 */
export default function Message(message = '系统异常，请稍后再试'): any {
  return function(target: any, methodName: string, descriptor: PropertyDescriptor) {
    const fun = descriptor.value;
    descriptor.value = async function(...args: any[]) {
      try {
        return await fun.apply(this, args);
      } catch (error) {
        const tips = safeGet(error, 'message') || message;
        // const code = safeGet(error, 'code');
        Antd.message.error(tips);
        return void 0;
      }
    };
  };
}