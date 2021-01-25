/*
 * @Author: MrZhang
 * @Date: 2021-01-06 18:27:49
 * @Description: 收益列表页
 */

import { Link } from 'react-router';
import React, { Component } from 'react';
import * as config from 'src/routers/config';
import * as serve from 'src/model/earnings/index';
import * as Search from 'src/utils/decorators/search';
import * as Loading from 'src/utils/decorators/loading';
import { Form, DatePicker, Button, Select, Table, Pagination } from 'antd';

import 'src/styles/goods/goods.scss';

// 注入 Loading
@Loading.Class()
export default class Demo1 extends Component<any, any> {
  constructor(props: any) {
    // 执行父类构造方法
    super(props);
    this.state = {
      selectedItem: "",
      selectedRowKeys: [],
      specificationsOpt: [],
      dataSource: [],
      total: '',
      page: 1,
      page_size: 10
    };
    this.onFinish = this.onFinish.bind(this);
    this.status = this.status.bind(this);
    this.onchangepageSize = this.onchangepageSize.bind(this);
    this.onChangeTime = this.onChangeTime.bind(this);
    this.earningsExport = this.earningsExport.bind(this);
    this.onSelectChange = this.onSelectChange.bind(this);
  }
  componentDidMount() {
    this.profitList();
    this.anchorList();
  }
  //收益列表
  @Search.debounce() // 该方法在一定时间段内只执行一次
  @Loading.Fun() // Loading 在什么时候触发

  //收益列表
  async profitList(value?: any): Promise<void> {
    try {
      const pram = Object.assign({
        page: 1,
        page_size: 10,
      }, value || {});
      const { data, total, current_page } = await serve.profitList(pram);
      this.setState({
        dataSource: data,
        total: total,
        page: current_page
      });
    } catch (err) {
      //todo
    }

  }
  //主播列表
  async anchorList() {
    const specificationsOpt = await serve.anchorList();
    specificationsOpt.unshift({ id: "", nickname: "全部" });
    this.setState({ specificationsOpt });
  }
  //选择时间
  onChangeTime(value, dateString) {
    this.setState({
      start_date: dateString[0],
      end_date: dateString[1]
    });
  }
  //选择主播
  status(value) {
    this.setState({ selectedItem: value });
  }
  //筛选
  onFinish() {
    const data = {
      anchor_id: this.state.selectedItem,
      start_date: this.state.start_date,
      end_date: this.state.end_date,
    };
    this.profitList(data);
  }
  //导出
  async earningsExport(value) {
    const { selectedRowKeys, start_date, end_date, selectedItem } = this.state;
    if (selectedRowKeys.length > 0) {
      const data = JSON.stringify(this.state.selectedRowKeys);
      const { down_url } = await serve.profitExport({ type: "ids", ids: data });
      window.open(down_url);
    } else {
      const data = { anchor_id: selectedItem, start_date, end_date, type: "list" };
      console.log('data: ', data);
      const { down_url } = await serve.profitExport(data);
      window.open(down_url);
    }
  }
  //支付方式
  payWay(type: any): React.ReactNode {
    const modelPay = {
      1: '微信',
      2: '支付宝',
    };
    return modelPay[type];
  }
  // table选择
  private onSelectChange(selectedRowKeys) {
    this.setState({ selectedRowKeys });
  }
  //下一页
  private onchangepageSize(page: number): void {
    this.profitList({ page });
  }
  render(): React.ReactElement {
    const { selectedItem, specificationsOpt, selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    return (
      <div>
        <div>
          <Form>
            <div className="dfx" >
              <div>
                <Form.Item label="选择时间:">
                  <DatePicker.RangePicker showTime format="YYYY-MM-DD HH:mm:ss" onChange={this.onChangeTime} />
                </Form.Item>
              </div>
              <div className="pl20">
                <Form.Item label="来源:">
                  <Select value={selectedItem} allowClear style={{ width: 250 }} placeholder="请选择" onChange={this.status}>
                    {specificationsOpt.map((item) => (
                      <Select.Option key={item.id} value={item.id}>
                        {item.nickname}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
              <div className="ml20">
                <Button type="primary" danger shape="round" onClick={this.onFinish}>筛选</Button>
              </div>
            </div>
          </Form>
        </div>
        <div className="dfx-jcsb mt20 pd20">
          <div></div>
          <div className="dfx-jcsa">
            <div className="ml10">
              <Button type="primary" danger shape="round" onClick={this.earningsExport}>导出</Button>
            </div>
          </div>
        </div>
        <div className="mt20">
          {/* 控制loading显示状态 */}
          <Table loading={Loading.getLoadingValue(this)} dataSource={this.state.dataSource} pagination={false} rowSelection={rowSelection} rowKey="id">
            <Table.Column title="订单编号" key="order_no" ></Table.Column>
            <Table.Column title="金额" dataIndex="real_price" key="real_price" ></Table.Column>
            <Table.Column title="来源" dataIndex="anchor_name" key="anchor_name" ></Table.Column>
            <Table.Column title="支付方式" dataIndex="pay_channel" key="pay_channel" render={this.payWay}></Table.Column>
            <Table.Column title="创建时间" dataIndex="pay_time" key="pay_time"></Table.Column>
          </Table>
        </div>
        <div className="flex flex-jcend pt20">
          <Pagination current={this.state.page} total={this.state.total} defaultPageSize={10} onChange={this.onchangepageSize}></Pagination>
        </div>

      </div>);
  }
}

