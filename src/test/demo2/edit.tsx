/**
 * @file 修改
 */
import React from 'react';
import FormBasis, { BasisState } from './common/basis';

class State implements BasisState {
  name = '';
  age = void 0;
}

class CreateForm extends FormBasis<any, State> {
  formSpaceName = 'edit';
  init (): void {
    this.state = new State();
  }
  getTitle (): React.ReactNode {
    return (<p>修改表单</p>);
  }
  onFinish (data: State): void {
    console.log(data);
  }
  // 当组建在页面上加载后调用
  async componentDidMount () {
    const data = await this.getDetail<State>();
    if (this.formRef) {
      const { current } = this.formRef;
      if (current) {
        // 表单回填
        current.setFieldsValue(data);
      }
    }
  }
  private async getDetail<T>(): Promise<T> {
    // 此处通过API获取详情
    const data = {
      name: '张三',
      age: 20
    };
    return Promise.resolve(data as any);
  }
}

export default CreateForm;