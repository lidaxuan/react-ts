/*
 * 商品列表页
 */
import React, { Component } from 'react';
import * as Search from 'src/utils/decorators/search';
import * as serve from 'src/model/goods/goods';
import * as Loading from 'src/utils/decorators/loading';
import Message from 'src/utils/decorators/message';
import { Form, Input, Select, Button, Table, Switch, Pagination, Modal, message } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import SingleEdit from './single';
import { Link } from 'react-router';
import * as config from 'src/routers/config';
const { Option } = Select;
const { confirm } = Modal;
import 'src/styles/goods/index.scss';
@Loading.Class()
export default class List extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      name: '',
      status: '',
      page: 1,
      page_size: 10,
      total: 0,
      list: [],
      selectedRowKeys: [],
      isModalVisible: false
    };
    this.changeName = this.changeName.bind(this);
    this.changeStatus = this.changeStatus.bind(this);
    this.getList = this.getList.bind(this);
    this.showName = this.showName.bind(this);
    this.expendTable = this.expendTable.bind(this);
    this.options = this.options.bind(this);
    this.changeTableStatus = this.changeTableStatus.bind(this);
    this.onChangetableStatusFn = this.onChangetableStatusFn.bind(this);
    this.onSelectChange = this.onSelectChange.bind(this);
    this.showTotal = this.showTotal.bind(this);
    this.changePagation = this.changePagation.bind(this);
    this.handleOk = this.handleOk.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.openModalFn = this.openModalFn.bind(this);
    this.batchFn = this.batchFn.bind(this);
    this.delGoods = this.delGoods.bind(this);
    this.copyGoods = this.copyGoods.bind(this);
    this.editSingle = this.editSingle.bind(this);
    this.statusFilterFn = this.statusFilterFn.bind(this);
    this.showImg = this.showImg.bind(this);
    this.downloadFn = this.downloadFn.bind(this);
  }
  componentDidMount() {
    this.getList();
  }
  @Search.onChange('name') // 将 e.target 的value值返回 data: { [key]: e.target.value }
  @Search.setState('name') // 将 data 数据存储到 state 中
  changeName(data: any): void {
    // 修改name
    this.setState({
      page: 1
    });
    console.log(this.state, 'change');
  }
  changeStatus(data: any): void {
    this.setState({
      status: data,
      page: 1
    });
  }
  // 获取列表
  @Search.debounce() // 该方法在一定时间段内只执行一次
  @Loading.Fun() // Loading 在什么时候触发
  @Message() // 监听异常，并提示异常信息
  async getList(): Promise<void> {
    this.setState({
      list: []
    });
    const query = {
      name: this.state.name,
      status: this.state.status,
      page: this.state.page,
      page_size: this.state.page_size
    };
    const data = await serve.goodsList(query);
    this.setState({
      list: data.data,
      total: data.total
    });
    // console.log(data, 'data------------');
  }
  // 下载
  private async downloadFn(): Promise<void> {
    // const {date} = this.state;
    try {
      const query = {};
      if (this.state.selectedRowKeys.length >= 1) {
        query['type'] = 'ids';
        query['ids'] = JSON.stringify(this.state.selectedRowKeys);
      } else {
        query['type'] = 'where';
        if (this.state.name) {
          query['name'] = this.state.name;
        }
        if (this.state.status) {
          query['status'] = this.state.status;
        }
      }
      console.log(this.state.selectedRowKeys, 'keys');
      const data = await serve.exportList(query);
      console.log(data, 'sss');

      const oa = document.createElement('a');
      oa.href = `${data.down_url}`;
      oa.setAttribute('target', '_blank');
      document.body.appendChild(oa);
      oa.click();
    } catch (error) {
      message.warning(error.msg);
    }
  }
  // 头部筛选
  private titleScreen (): React.ReactNode {
    return (
      <Form
        name="screen_form"
        layout="inline"
      >
        <Form.Item label="商品名称：">
          <Input placeholder="请输入商品名称" value={this.state.name} style={{ width: 160 }} onChange={this.changeName}/>
        </Form.Item>
        <Form.Item label="状态：">
          <Select defaultValue="" style={{ width: 160 }} placeholder="请选择" onChange={this.changeStatus}>
            <Option value="">全部</Option>
            <Option value="1">上架</Option>
            <Option value="2">下架</Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Button onClick={this.getList} type="primary" danger>筛选</Button>
        </Form.Item>
      </Form>
    );
  }
  // 商品名称
  private showName(record): React.ReactNode {
    return (
      <div className="flex flex-center">
        <img className="table-img" src={record.humbnail_img} alt=""/>
        <div>{record.name}</div>
      </div>
    );
  }
  // 规格图片
  private showImg(record): React.ReactNode {
    return (
      <img className="table-img" src={record.image}></img>
    );
  }
  // 操作
  private options(record): React.ReactNode {
    const to = {
      pathname: config.routers.goods.edit,
      query: { id: record.id }
    };
    return (
      <div className="flex-center wrap">
        <Link to={to} className="pointer">编辑</Link>
        <p className="pointer ml15" onClick={() => this.openModalFn(record)}>{record.audit_status === 3 ? '从直播删除' : '提交直播审核'}</p>
        <p className="pointer ml15" onClick={() => this.copyGoods(record)}>复制该商品</p>
        <p className="pointer ml15" onClick={() => this.delGoods(record)}>删除</p>
        {/* <p className="pointer ml15">分享</p> */}
      </div>
    );
  }
  // 直播审核状态
  private statusFilterFn(record): React.ReactNode {
    return (
      <p>{record.audit_status === 1 ? '未提审' : record.audit_status === 2 ? '审核中' : record.audit_status === 3 ? '通过' : '驳回'}</p>
    );
  }
  // 更改表格的上下架状态
  private changeTableStatus(record: any): React.ReactNode {
    const checked = record.status === 1 ? true : false;
    const onChange = this.onChangetableStatusFn.bind(this, record);
    return (
      <Switch defaultChecked={ checked } onChange={ onChange } />
    );
  }
  // 更改上下架状态
  private async onChangetableStatusFn(record: any) {
    const ids = [record.id];
    const query = {
      ids: JSON.stringify(ids),
      status: record.status === 1 ? 2 : 1
    };
    try {
      await serve.goodsStatus(query);
      this.setState({
        list: [],
        selectedRowKeys: []
      });
      message.success('修改成功');
      this.getList();
    } catch (error) {
      message.warning('修改失败');
      this.getList();
      // return false;
    }
  }
  // 修改单字段
  private editSingle(text, record): React.ReactNode {
    let keyName = '';
    for(const i in record) {
      if (record[i] === text) {
        keyName = i;
      }
    }
    return(
      <SingleEdit info={record} name={keyName}></SingleEdit>
    );
  }

  // 扩展的table
  private expendTable(record) {
    return (
      <Table dataSource={record.goods_sku} rowKey="id" pagination={false}>
        <Table.Column title="规格值" dataIndex="name" key="name"></Table.Column>
        <Table.Column title="成本价" dataIndex="cost_price" render={this.editSingle}></Table.Column>
        <Table.Column title="原价" dataIndex="original_price" key="original_price" render={this.editSingle}></Table.Column>
        <Table.Column title="售价" dataIndex="selling_price" key="selling_price" render={this.editSingle}></Table.Column>
        <Table.Column title="库存" dataIndex="stock" key="stock" render={this.editSingle}></Table.Column>
        <Table.Column title="限购数" dataIndex="limit_num" key="limit_num" render={this.editSingle}></Table.Column>
        <Table.Column title="直播间最低价" dataIndex="studio_price" key="studio_price" render={this.editSingle}></Table.Column>
        <Table.Column title="规格图" render={this.showImg}></Table.Column>
      </Table>
    );
  }
  // table选择
  private onSelectChange(selectedRowKeys) {
    this.setState({ selectedRowKeys });
  }
  // 总共条数
  showTotal(total) {
    return `共计${total}条记录 `;
  }
  // 翻页
  private changePagation(page, pageSize) {
    this.setState({
      page: page,
      page_size: pageSize
    });
    this.getList();
  }
  // 提交弹框确定
  private openModalFn(record) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this;
    if (record.audit_status !== 3) {
      this.setState({
        isModalVisible: false
      });

      confirm({
        title: '提交审核',
        icon: <ExclamationCircleOutlined />,
        content: '提交审核后,直播商品只能修改价格。其他信息、物料无法编辑',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        async onOk() {
          await serve.goodsAudit({id: record.id});
          message.success('提交成功');
          that.setState({
            list: [],
            selectedRowKeys: [],
            page: 1
          });
          that.getList();
          console.log(record, 'OK');
        },
        onCancel() {
          console.log('Cancel');
        },
      });
    } else {
      confirm({
        title: '提示',
        icon: <ExclamationCircleOutlined />,
        content: '确定要删除吗？',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        async onOk() {
          await serve.goodsLiveDel({live_goods_id: record.live_goods_id});
          message.success('删除成功');
          that.setState({
            list: [],
            selectedRowKeys: [],
            page: 1
          });
          that.getList();
          console.log(record, 'OK');
        },
        onCancel() {
          console.log('Cancel');
        },
      });
    }
  }
  private handleOk() {
    this.setState({
      isModalVisible: false
    });
  }
  private handleCancel() {
    this.setState({
      isModalVisible: false
    });
  }
  // 批量上下架
  @Message()
  private async batchFn(num?: string): Promise<void>{
    if (this.state.selectedRowKeys.length <= 0) {
      // 将异常信息冒泡给 @Message 装饰器
      return Promise.reject({ message: '商品不能为空' });
    }
    const query = {
      ids: JSON.stringify(this.state.selectedRowKeys),
      status: num
    };
    try {
      await serve.goodsStatus(query);
      this.setState({
        list: [],
        selectedRowKeys: [],
        page: 1
      });
      this.getList();
    } catch (error) {
      return Promise.reject(error);
    }
  }
  // 删除商品
  private async delGoods(record): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this;
    confirm({
      title: '提示',
      icon: <ExclamationCircleOutlined />,
      content: '确定要删除吗？',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      async onOk() {
        await serve.goodsDel({id: record.id});
        message.success('删除成功');
        that.setState({
          list: [],
          selectedRowKeys: [],
          page: 1
        });
        that.getList();
        console.log(record, 'OK');
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }
  // 复制商品
  private async copyGoods(record): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this;
    confirm({
      title: '提示',
      icon: <ExclamationCircleOutlined />,
      content: '确定要复制吗？',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      async onOk() {
        await serve.goodsCopy(record.id);
        message.success('复制成功');
        that.setState({
          list: [],
          selectedRowKeys: [],
          page: 1
        });
        that.getList();
        console.log(record, 'OK');
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }
  render() {
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const expendOptions = {
      expandedRowRender: this.expendTable,
      rowExpandable: record => record.name !== 'Not Expandable',
    };
    return(
      <div>
        <div>
          { this.titleScreen() }
        </div>
        <div className="btn-container mt20">
          <div>
            <Button className="w110" onClick={() => this.batchFn('1')}>批量上架</Button>
            <Button className="ml15 w110" onClick={() => this.batchFn('2')}>批量下架</Button>
          </div>
          <div>
            <Button className="w110" onClick={this.downloadFn} type="primary">导出</Button>
            <Link className="dibk" to={config.routers.goods.create}>
              <Button className="ml15 w110" type="primary">新建</Button>
            </Link>
          </div>
        </div>
        <Table loading={Loading.getLoadingValue(this)} dataSource={this.state.list} rowKey="id" rowSelection={ rowSelection } expandable={ expendOptions } pagination={ false } className="mt20">
          <Table.Column title="商品名称" key="name" render={this.showName} width={350}></Table.Column>
          <Table.Column title="类目" dataIndex="category_name" key="category_name" width={150}></Table.Column>
          <Table.Column title="剩余库存" dataIndex="use_stock" key="use_stock" width={150}></Table.Column>
          <Table.Column title="实际销量" dataIndex="sales" key="sales" width={150}></Table.Column>
          <Table.Column title="店铺上下架状态" width={150} render={ this.changeTableStatus }></Table.Column>
          <Table.Column title="直播审核状态" key="audit_status" width={150} render={ this.statusFilterFn }></Table.Column>
          <Table.Column title="直播权限" dataIndex="anchor_name" key="anchor_name" width={150}></Table.Column>
          <Table.Column title="创建时间" dataIndex="created_at" key="created_at" width={180}></Table.Column>
          <Table.Column title="操作" dataIndex="" key="" render={this.options} fixed="right" width={350}></Table.Column>
        </Table>
        <Pagination size="small" style={{'marginTop': '20px'}} showTotal={this.showTotal} current={this.state.page} total={this.state.total} showSizeChanger onChange={this.changePagation}/>
        <Modal title="提交审核" visible={this.state.isModalVisible} onOk={this.handleOk} onCancel={this.handleCancel}>
          <p>提交审核后,直播商品只能修改价格。其他信息、物料无法编辑</p>
        </Modal>
      </div>
    );
  }
}