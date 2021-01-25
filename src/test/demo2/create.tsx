/**
 * @file 创建
 */
import React from 'react';
import FormBasis, { BasisState } from './common/basis';

class State implements BasisState {
  name = '';
  age = void 0;
}

class CreateForm extends FormBasis<any, State> {
  formSpaceName = 'create';
  init (): void {
    this.state = new State();
  }
  getTitle (): React.ReactNode {
    return (<p>创建表单</p>);
  }
  onFinish (data: State): void {
    console.log(data);
  }
}

export default CreateForm;