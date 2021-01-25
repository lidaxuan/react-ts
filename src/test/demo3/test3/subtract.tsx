/**
 * @file 子组件接收数据
 * @author svon.me@gmail.com
 */

import Add from './add';

export default class Subtract extends Add {
  title = '子组件: Subtract';
  buttonText = '减 10';
  // 重写父类(Add)的 onClick 方法
  onClick(): void {
    const { number = 10, onChange } = this.props;
    if (onChange) {
      const value = number - 10;
      onChange(value);
    }
  }
}
