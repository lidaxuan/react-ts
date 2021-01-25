
import React from 'react';
import {Form,Input,Select,DatePicker, Button,Table, Pagination,Modal,message } from 'antd';
import 'src/styles/orderList.scss';
import 'src/styles/live.scss';
import { Link } from 'react-router';
import * as config from 'src/routers/config';
import { getOrderList } from 'src/model/order';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import * as Search from 'src/utils/decorators/search';
import * as Loading from 'src/utils/decorators/loading';
import Message from 'src/utils/decorators/message';
const { confirm } = Modal;
const { RangePicker } = DatePicker;

interface Query {
  page?: number;
  page_size?: number;
}

const orderStatus = {
  1:'待付款',
  2:'未发货',
  3:'已发货',
  4:'已收货',
  5:'已关闭',
  6:'已取消',
  7:'已删除'
};
const optionsList = [
  {
    key:1,
    value:'待付款'
  },
  {
    key:2,
    value:'未发货'
  },
  {
    key:3,
    value:'已发货'
  },
  {
    key:4,
    value:'已收货'
  },
  {
    key:5,
    value:'已关闭'
  },
  {
    key:6,
    value:'已取消'
  },
  {
    key:7,
    value:'已删除'
  }
];


@Loading.Class()
export default class LiveList extends React.Component<any,any> {
  constructor(props: any) {
    super(props);
    // 设置默认值
    this.state = {
      current: 1,
      tableList: [],
      page: 1,
      page_size: 10,
      total: 0,
      form:{
        order_no: '',
        order_status: 'wait_pay', 
      }
    };
    this.onFinish = this.onFinish.bind(this);
    this.onChangeTime = this.onChangeTime.bind(this);
    // 分页发生变化
    this.onPageSizeChange = this.onPageSizeChange.bind(this);
    this.getOperation = this.getOperation.bind(this);
    this.delLive = this.delLive.bind(this);
  }
  componentDidMount () {
    // 默认请求第一页数据
    this.getOrderList({ 
      page: 1
    });
  }
  @Search.debounce() // 该方法在一定时间段内只执行一次
  @Loading.Fun()
  @Message() // 处理接口异常
  async getOrderList(query?: Query) {
    let param = Object.assign({}, {
      page: this.state.page,
      page_size: this.state.page_size
    }, query || {});
    param = Object.assign({}, param ,this.state.form);
    const result = await getOrderList<any>(param);
    const { data = [], total = 1 } = result || {};
    this.setState({
      tableList: [].concat(data),
      total: total,
      page: param.page
    });
  }
  protected onFinish(value){
    this.setState({
      form:{
        order_no: value.order_no,
        order_status: value.order_status,
        pay_channel: value.pay_channel,
        start_date: this.state.form.start_date,
        end_date: this.state.form.end_date,
      }
    });
    this.getOrderList();
  }
  protected onChangeTime(values,dateString){
    this.setState({
      form:{
        start_date:dateString[0],
        end_date:dateString[1]
      }
      
    });
  }
  //删除主播
  private async delLive(record) :Promise<void>{
    console.log(record,'record');
    //const that = this;
    confirm({
      title: '提示',
      icon: <ExclamationCircleOutlined />,
      content: '确定要删除吗？',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      async onOk() {
        //await serve.goodsDel({id: record.id});
        message.success('删除成功');
        // this.setState({
        //   list: [],
        //   selectedRowKeys: [],
        //   page: 1
        // });
        //that.getList();
        console.log(record, 'OK');
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }
  private async stopLive(record): Promise<void> {
    console.log(record,'record');
    //const that = this;
    confirm({
      title: '提示',
      icon: <ExclamationCircleOutlined />,
      content: '确定要停用吗？',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      async onOk() {
        //await serve.goodsDel({id: record.id});
        message.success('停用成功');
        // that.setState({
        //   list: [],
        //   selectedRowKeys: [],
        //   page: 1
        // });
        //that.getList();
        console.log(record, 'OK');
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }
  // 切换分页
  private onPageSizeChange(page: number): void {
    this.getOrderList({ page });
  }
  private getPayChannel(type: number | string): string {
    let text: string;
    switch(type) {
    case 1:
    case '1':
      text = '微信';
      break;
    default:
      text = '支付宝';
      break;
    }
    return text;
  }
  // 操作
  private getOperation(record: any): React.ReactNode {
    const info = {
      pathname: config.routers.live.add,
      query: {
        id: record.id
      }
    };
    return (<div>
      <Link className="dibk" to={ info }><span className="pointer">编辑</span></Link>
      <p className="dibk ml10 pointer" onClick={()=>this.delLive(record)}>删除</p>
      <p className="dibk ml10 pointer" onClick={()=>this.stopLive(record)}><span>停用</span></p>
    </div>);
  }
  render(): React.ReactElement {
    const options = optionsList.map(d=><Select.Option key={d.key} value={d.key}>{d.value}</Select.Option>);
    return (
      <div className="pd20">
        <Form
          name="basic"
          className="formBox"
          initialValues={this.state.form}
          onFinish={this.onFinish}
        >
          <Form.Item
            label="主播姓名"
            name="order_no"
          >
            <Input placeholder="请输入主播姓名"/>
          </Form.Item>
          <Form.Item
            label="审核状态"
            name="order_status"
          >
            <Select placeholder="请选择" style={{width:'90px'}}>
              {options}
            </Select>
          </Form.Item>
          <Form.Item
            label=""
          >
            <Button type="primary" shape="round" htmlType="submit">筛选</Button>
          </Form.Item>
        </Form>
        <div className="btnBox">
          <Link to={config.routers.live.add}>
            <Button type="primary" shape="round">添加主播</Button>
          </Link>
          
        </div>
        {/* 控制loading显示状态 */}
        <Table loading={ Loading.getLoadingValue(this) } dataSource={this.state.tableList} rowKey="id" pagination={ false }>
          <Table.Column title="序号" dataIndex="order_no" key="order_no"></Table.Column>
          <Table.Column title="主播姓名" dataIndex="pay_time" key="pay_time"></Table.Column>
          <Table.Column title="手机号" dataIndex="created_at" key="created_at"></Table.Column>
          <Table.Column title="实名认证状态" dataIndex="pay_channel" key="pay_channel" render={ this.getPayChannel }></Table.Column>
          <Table.Column title="操作" render={ this.getOperation }></Table.Column>
        </Table>
        <div className="flex flex-jcend pt20">
          <Pagination current={ this.state.page } total={this.state.total} defaultPageSize={ 10 } onChange={ this.onPageSizeChange }></Pagination>
        </div>
      </div>
    );
  }
}

