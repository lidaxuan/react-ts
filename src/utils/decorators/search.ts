/**
 * @file 搜索装饰器
 * @author svon.me@gmail.com
 */

import _ from 'lodash';

/**
 * 一段时间内多次执行，只触发一次
 * @param time 时间范围
 */
export function debounce(time = 500) {
  return function(target: any, methodName: string, descriptor: PropertyDescriptor) {
    descriptor.value = _.debounce(descriptor.value, time);
  };
}

/**
 * 处理 input 时时输入时的内容
 * @param keywordName 返回数据时搜索框中值对应的键名
 */
export function onChange(keywordName = 'keyword') {
  return function(target: any, methodName: string, descriptor: PropertyDescriptor) {
    const fun = descriptor.value;
    descriptor.value = function(e: any) {
      const { value } = e.target || {};
      const keyword = _.trim(value) || '';
      const query = { pageNum: 1 };
      query[keywordName] = keyword;
      fun.call(this, query);
    };
  };
}

/**
 * 将数据更新到 state 中
 * @param key  数据中的键名
 * @param name 保存到state中名称
 */
export function setState(key?: string, name?: string) {
  return function(target: any, methodName: string, descriptor: PropertyDescriptor) {
    const fun = descriptor.value;
    descriptor.value = function(data: any) {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const self: any = this;
      const state = {};
      if (key && name) {
        state[name] = data[key];
      } else if (key) {
        state[key] = data[key];
      } else {
        for (const item of data) {
          const [k, value] = item;
          state[k] = value;
        }
      }
      self.setState(state, () => {
        fun.call(this, data);
      });
    };
  };
}
