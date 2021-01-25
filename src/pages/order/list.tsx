/*
 * @Author: MrZhang
 * @Date: 2021-01-06 11:12:13
 * @Description: 订单列表
 */
import React from 'react';
import { Form, Input, Select, Space, DatePicker, Button, Table, Pagination, Upload } from 'antd';
import 'src/styles/orderList.scss';
import { Link } from 'react-router';
import * as config from 'src/routers/config';
import *as serve from 'src/model/order';
import * as Search from 'src/utils/decorators/search';
import * as Loading from 'src/utils/decorators/loading';
import Message from 'src/utils/decorators/message';
import env from 'src/env/index';


const { RangePicker } = DatePicker;

interface Query {
  page?: number;
  page_size?: number;
}

const optionsList = [
  {
    key: "",
    value: "全部"
  },
  {
    key: 'wait_pay',
    value: '待付款'
  },
  {
    key: "wait_confirm",
    value: '待收货'
  },
  {
    key: "received",
    value: '已收货'
  },
  {
    key: "cancel",
    value: '已删除'
  },
  {
    key: "refund",
    value: '售后'
  },
  {
    key: "complete",
    value: '已完成'
  }
];

@Loading.Class()
export default class OrderList extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    // 设置默认值
    this.state = {
      selectedRowKeys: [],
      current: 1,
      tableList: [],
      page: 1,
      page_size: 10,
      total: 0,
      form: {
        order_no: '',
        order_status: '',
        start_date: '',
        end_date: '',
        pay_channel: ''
      }
    };
    this.onSelectChange = this.onSelectChange.bind(this);
    this.onFinish = this.onFinish.bind(this);
    this.onChangeTime = this.onChangeTime.bind(this);
    // 分页发生变化
    this.onPageSizeChange = this.onPageSizeChange.bind(this);
    this.earningsExport = this.earningsExport.bind(this);
    this.status = this.status.bind(this);
    this.pay_channelstatus = this.pay_channelstatus.bind(this);
    this.logtemplatedownload = this.logtemplatedownload.bind(this);
    this.changse = this.changse.bind(this);
    this.toLead = this.toLead.bind(this);
  }
  componentDidMount() {
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
    param = Object.assign({}, param, this.state.form);
    const result = await serve.getOrderList<any>(param);
    const { data = [], total = 1 } = result || {};
    this.setState({
      tableList: [].concat(data),
      total: total,
      page: param.page
    });
  }
  // 订单状态
  private getOrderStatus(type) {
    const { order_status, refund_status } = type;
    const orderStatus = {
      1: '待付款',
      2: '未发货',
      3: '已发货',
      4: '已收货',
      5: '已关闭',
      6: '已取消',
      7: '已删除',
      8: '售后',
      9: '完成',
    };
    const afterState = {
      1: "申请",
      2: "通过",
      3: "等待",
      4: "退款",
      5: "驳回"
    };
    if (order_status === 8) {
      return afterState[refund_status];
    } else {
      return orderStatus[order_status];
    }
  }
  //下单时间
  protected onChangeTime(values, dateString) {
    this.setState({
      form: {
        start_date: dateString[0],
        end_date: dateString[1]
      }
    });
  }
  //付款方式
  private getPayChannel(type: number | string): string {
    const modelPay = {
      1: '微信',
      2: '支付宝',
    };
    return modelPay[type];
  }
  //筛选按钮
  protected onFinish(value) {
    this.setState({
      form: {
        order_no: value.order_no,
        order_status: value.order_status,
        pay_channel: value.pay_channel,
        start_date: this.state.form.start_date,
        end_date: this.state.form.end_date,
      }
    });
    this.getOrderList();
  }

  //全选
  protected onSelectChange(selectedRowKeys, selectedRows) {
    this.setState({ selectedRowKeys });
  }
  // 金额
  private getGoodsPrice(price: number): React.ReactNode {
    return (<span>￥{price / 100}</span>);
  }
  // 订单类型
  private getOrderType(type): string {
    const orderType = {
      1: '普通订单',
      2: '实时订单',
    };
    return orderType[type];
  }
  //物流信息
  private logisticsMsg(type): React.ReactNode {
    const { logistics } = type;
    return (
      <div>
        <div>快递公司：{logistics.express_name || "待填写快递公司"}</div>
        <div>物流单号：{logistics.express_number || "待填写物流订单号"}</div>
      </div>
    );
  }
  // 操作
  private getOperation(item: any): React.ReactNode {
    const to = {
      pathname: config.routers.order.info,
      query: {
        id: item.id
      }
    };
    const sale = {
      pathname: config.routers.order.service.detail,
      query: {
        id: item.id
      }
    };
    return (
      <div>
        <Space size="middle">
          <Link to={to}><span>详情</span></Link>
          {
            item.order_status === 8 ? <Link to={sale}><span>售后</span></Link> : null
          }
        </Space >
      </div>
    );
  }
  // 切换分页
  private onPageSizeChange(page: number): void {
    this.getOrderList({ page });
  }
  //状态
  status(value) {
    const data = Object.assign({}, this.state.form, { order_status: value });
    this.setState({ form: data });
  }
  //支付
  pay_channelstatus(value) {
    const data = Object.assign({}, this.state.form, { pay_channel: value });
    this.setState({ form: data });
  }
  //导出
  async earningsExport(value) {
    const { selectedRowKeys, form } = this.state;
    if (selectedRowKeys.length > 0) {
      const data = JSON.stringify(this.state.selectedRowKeys);
      const { down_url } = await serve.orderExport({ type: "ids", ids: data });
      window.open(down_url);
    } else {
      const data = Object.assign({}, form, { type: "list" });
      const { down_url } = await serve.orderExport(data);
      window.open(down_url);
    }
  }
  //物流模板下载
  async logtemplatedownload() {
    try {
      const { down_url } = await serve.templatedownload({ type: 'logistics' });
      window.open(down_url);
    } catch (error) {
      //todo
    }
  }
  //物流导入
  toLead() {
    return "";
  }
  //物流模板上传
  changse(value) {
    console.log('value: ', value);
  }
  render(): React.ReactElement {
    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const uplet = {
      action: this.toLead,
      onChange: this.changse,
    };
    return (
      <div className="pd20">
        {/* 筛选 */}
        <Form name="basic" className="formBox" initialValues={this.state.form} onFinish={this.onFinish}>
          <Form.Item label="订单号" name="order_no" >
            <Input placeholder="请输入订单编号" />
          </Form.Item>
          <Form.Item label="状态" name="order_status">
            <Select placeholder="请选择" style={{ width: '100px' }} onChange={this.status}>
              {optionsList.map((item, index) => {
                return (
                  <Select.Option key={index} value={item.key}>{item.value}</Select.Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item label="下单时间" name="start_date">
            <RangePicker format="YYYY/MM/DD" onChange={this.onChangeTime} />
          </Form.Item>
          <Form.Item label="付款方式" name="pay_channel">
            <Select placeholder="请选择" style={{ width: '100px' }} onChange={this.pay_channelstatus}>
              <Select.Option value="">全部</Select.Option>
              <Select.Option value="1">微信</Select.Option>
              <Select.Option value="2">支付宝</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="" >
            <Button type="primary" htmlType="submit">筛选</Button>
          </Form.Item>
        </Form>
        {/* 下载导出 */}
        <div className="dfx-jcsb mb30 mt10">
          <div></div>
          <div className="dfx-jcsb">
            <div><Button className="ml15" type="primary" onClick={this.logtemplatedownload}>下载物流模板</Button></div>
            <Upload {...uplet}>
              <Button className="ml15" type="primary">上传物流信息</Button>
            </Upload>
            <div><Button className="ml15" type="primary" onClick={this.earningsExport}>导出</Button></div>
          </div>
        </div>
        {/* 表格 */}
        <Table loading={Loading.getLoadingValue(this)} dataSource={this.state.tableList} rowSelection={rowSelection} rowKey="id" pagination={false}>
          <Table.Column title="订单编号" dataIndex="order_no" key="order_no"></Table.Column>
          <Table.Column title="订单金额" dataIndex="goods_price" key="goods_price" render={this.getGoodsPrice}></Table.Column>
          <Table.Column title="实收金额" dataIndex="real_price" key="real_price" render={this.getGoodsPrice}></Table.Column>
          {/* <Table.Column title="支付方式" dataIndex="pay_channel" key="pay_channel" render={this.getPayChannel}></Table.Column> */}
          <Table.Column title="订单类型" dataIndex="order_type" key="order_type" render={this.getOrderType}></Table.Column>
          <Table.Column title="订单状态" key="order_status" render={this.getOrderStatus}></Table.Column>
          <Table.Column title="物流信息" key="logistics" render={this.logisticsMsg}></Table.Column>
          <Table.Column title="下单时间" dataIndex="created_at" key="created_at"></Table.Column>
          <Table.Column title="支付时间" dataIndex="pay_time" key="pay_time"></Table.Column>
          <Table.Column title="操作" key="id" render={this.getOperation}></Table.Column>
        </Table>
        {/* 分页 */}
        <div className="flex flex-jcend pt20">
          <Pagination current={this.state.page} total={this.state.total} defaultPageSize={10} onChange={this.onPageSizeChange}></Pagination>
        </div>
      </div>
    );
  }
}

