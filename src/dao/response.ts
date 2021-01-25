/**
 * @file http 响应处理
 * @author 15201002062@163.com
 */

// import { message } from 'antd';

const Code = {
  success: 10000
};

export function Success(response: any): any {
  if (response.code === Code.success) {
    return response.data;
  }
  // 某些场景下不需要提示错误信息
  // 参考 src/utils/decorators/message 
  // 通过装饰器来处理
  // if (response.code !== Code.success) {
  //   message.error(response.msg);
  // }
  // 按异常处理
  return Promise.reject(response);
}

