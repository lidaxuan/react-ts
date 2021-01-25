/**
 * @file 修改收货信息
 * @author 15201002061@163.com
 */

import _ from 'lodash';
import React, { Component } from 'react';
import '../../../styles/goods/create.scss';
import { FormInstance } from 'antd/lib/form';
import { Button, Form, Input, Collapse, message } from 'antd';
import { PlusCircleOutlined, PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
const { Panel } = Collapse;

import { goodsCategoryList, goodsCategoryAdd, goodsCategoryDel } from 'src/model/goods/goods';
export interface State {
  [key: string]: any;
}

export interface Props {
  [key: string]: any;
}

const formProps: any = {
  labelCol: {
    style: {
      width: '120px'
    }
  },
  autoComplete: 'off'
};

export default class EditAddress extends Component<Props, State> {
  formRef = React.createRef<FormInstance>();
  formSpaceName = ''; // 表单命名空间，防止组建重复使用，避免冲突
  constructor(props: any) {
    super(props);
    this.state = {
      categoryList: [],
    };
    this.onChangeValues = this.onChangeValues.bind(this);
    this.addMenuOne = this.addMenuOne.bind(this);
    this.addFirstLevelCategory = this.addFirstLevelCategory.bind(this);
    this.delMenuOne = this.delMenuOne.bind(this);
    this.delMenuTwo = this.delMenuTwo.bind(this);
    this.onFinish = this.onFinish.bind(this);
    this.getGoodsCategoryList = this.getGoodsCategoryList.bind(this);
    this.addCategory = this.addCategory.bind(this);
    this.iptBlue = this.iptBlue.bind(this);

  }
  
  // 初始化方法
  componentDidMount() {
    // this.props.getComponentRef('addClass', this.state.menu);
    this.getGoodsCategoryList();
    // this.setState({categoryList: [].concat(this.props.categoryList)});
  }
  componentWillUnmount = () => {
    this.setState = (state,callback)=>{
      return;
    };
  }
  // 获取商品类目
  async getGoodsCategoryList() {
    const data = await goodsCategoryList();
    this.setState({categoryList: [].concat(data)});
  }
  // 添加二级类目
  addMenuOne(e,index) {
    try {
      e.stopPropagation();
      const categoryList = this.state.categoryList;
      if (!categoryList[index]['child']) {
        categoryList[index]['child'] = [];
      }
      categoryList[index]['child'].push({name: ''});
      this.setState({
        categoryList
      });
      message.success("添加成功");
    } catch (error) {
      console.log(error, 's');
      message.error('添加失败');
    }
    
  }
  // 删除一级类目
  async delMenuOne(e, index, item): Promise<void> {
    try {
      e.stopPropagation();
      const query = {
        id: item.id
      };
      await goodsCategoryDel(query);
      const categoryList = this.state.categoryList;
      categoryList.splice(index, 1);
      this.setState({
        categoryList
      });
      message.success("删除成功");
    } catch (error) {
      console.log(error, 's');
      message.error('删除失败');
    }
    
  }
  // 删除二级类目
  async delMenuTwo(e, index, item): Promise<void> {
    try {
      e.stopPropagation();
      const query = {
        id: item.id
      };
      await goodsCategoryDel(query);
      // 根据pid去删除child中某一项
      const newList = JSON.parse(JSON.stringify(this.state.categoryList));
      newList.map( (val: any) => {
        if (val.id === item.pid) {
          val.child.splice(index, 1);
        }
      });
      this.setState({
        categoryList: newList
      });
      message.success("删除成功");
    } catch (error) {
      console.log(error, 's');
      message.error('删除失败');
    }
    
  }
  // 添加一级类目
  addFirstLevelCategory() {
    const { current } = this.formRef;
    const { oneVal } = current.getFieldsValue();
    if (!oneVal) {
      message.warning('请输入一级类目名称');
      return;
    }
    this.addCategory(oneVal, 0);
    current.setFieldsValue({
      oneVal: undefined
    });
  }
  async addCategory(name: string, pid: number | string) {
    const res = await goodsCategoryAdd({name, pid});
    if (res.id) {
      this.getGoodsCategoryList(); 
    }
  }
  // 表单数据修改
  protected onChangeValues(values: State): void {
    // 表单数据
    console.log(values);
  }

  // 获取表单数据
  protected onFinish() {
    console.log(this.state.menu);
    
  }
  // 输入框发生变化
  protected iptChange(e: any, pindex: number, index:any, id: number | string) {
    const categoryList = this.state.categoryList;
    const target: HTMLInputElement = e.target;
    if (target) {
      const text: string = target.value;
      categoryList[pindex]['child'][index]['name'] = text;
      // this.addCategory(text, id);
      this.setState({
        categoryList:categoryList
      });
    }
  }
  protected iptBlue(e: any, pindex: number, index:any, id: number | string) {
    const categoryList = this.state.categoryList;
    const target: HTMLInputElement = e.target;
    if (target) {
      const text: string = target.value;
      categoryList[pindex]['child'][index]['name'] = text;
      this.addCategory(text, id);
      
    }
  }
  
  protected getFieldValue<T>(key: any): T {
    if (this.formRef) {
      const { current } = this.formRef;
      if (current && current.getFieldValue) {
        const value: T = current.getFieldValue(key);
        return value;
      }
    }
    return void 0;
  }
  getFormNode(): React.ReactNode {
    return (<Form ref={this.formRef}>
      <div className="center">
        <Form.Item name="oneVal">
          <Input  placeholder="请输入要添加的一级类目" />
        </Form.Item>
        <Button className="ml10" type="primary" onClick={this.addFirstLevelCategory}>
        添加一级类目
        </Button>
      </div>
    </Form>);
  }
  protected getContent(): React.ReactNode {
    const state: State = this.state;
    return (
      <div>
        <div>
          {this.getFormNode()}
        </div>
          
        <Collapse defaultActiveKey={['0']}>
          
          {state.categoryList.map((item, index) => {
            return (
              <Panel header={item.name} key={index} extra={
                <div>
                  <PlusCircleOutlined onClick={(e) =>this.addMenuOne(e,index)} />
                  <MinusCircleOutlined className="ml10" onClick={(e) =>this.delMenuOne(e, index, item)}/>
                </div>}>
                {
                  item.child && item.child.map((val, ind) => {
                    return (
                      <div className="mb10" key={ind}>
                        <Input className={val.id ? 'none' : ''} maxLength={6} value={val.name} style={{'width': '410px'}} onBlur={ e => {this.iptBlue(e, index, ind, item.id );}} onChange={ e => {this.iptChange(e, index, ind, item.id );} }></Input>
                        <span className={val.id ? '' : 'none'} style={{'width': '410px'}}>{val.name}</span>
                        <MinusCircleOutlined className="ml10" onClick={(e) =>this.delMenuTwo(e, index, val)}/>
                      </div>
                    );
                  })
                }
              </Panel>
            );
          })}
        </Collapse>
      </div>
    );
  }
  render(): React.ReactElement {
    return (<div>
      <div>
        {this.getContent()}
      </div>
    </div>);
  }
}