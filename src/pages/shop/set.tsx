
import React from 'react';
import {Form, Button,Radio,Cascader,Input,Table, Pagination,message  } from 'antd';
import { FormInstance } from 'antd/lib/form';
import 'src/styles/shopSet.scss';
import { Link } from 'react-router';
import * as config from 'src/routers/config';
import * as Search from 'src/utils/decorators/search';
import * as Loading from 'src/utils/decorators/loading';
import Message from 'src/utils/decorators/message';
import Upload from 'src/components/upload/index';
import { goodsCategoryList,goodsList } from 'src/model/goods/goods';
import { studioList,bannerInfo,bannerEdit } from 'src/model/shop/index';
@Loading.Class()
export default class ShopSet extends React.Component<any,any> {
  formRef = React.createRef<FormInstance>();  
  constructor(props: any) {
    super(props);
    // 设置默认值
    this.state = {
      form:{
        id: '',
        image: '', 
        type: '',
        join_id: '',
      },
      studioTitle:'',
      categoryList:[],
      checkedIndex:0,
      selectedRowKeys:[],
      bannerInfo:{
        id:'',
        image:'',
        type:1,
        join_id:0
      },
      goodsList:[],
      radioGroup:1,
      tableList:[],
      total:0,
      goods_category:'',
      page:1,
      page_size:10,
      goodsName:''
    };
    this.onFinish = this.onFinish.bind(this);
    this.onSelectChange = this.onSelectChange.bind(this);
    this.onChangeRadio = this.onChangeRadio.bind(this);
    //选择直播间
    this.onchangeCategory = this.onchangeCategory.bind(this);
    //直播间名称搜索
    this.searchStudio = this.searchStudio.bind(this);
    //商品名称搜索
    this.searchGoods = this.searchGoods.bind(this);
    //选择商品
    this.checkedGoods = this.checkedGoods.bind(this);
    // 分页发生变化
    this.onPageSizeChange = this.onPageSizeChange.bind(this);
  }
  componentDidMount () {
    this.getGoodsCategoryList();
    this.getBannerInfo();
  }
  @Search.debounce() // 该方法在一定时间段内只执行一次
  @Loading.Fun()
  @Message() // 处理接口异常
  protected onFinish(value){
    console.log(value,'value');
    this.setState({
      bannerInfo:{
        id: this.state.bannerInfo.id,
        image: value.image.split('.com')[1],
        join_id	: this.state.selectedRowKeys.toString(),
        type: value.type,
      }
    },async ()=>{
      const data = await bannerEdit(this.state.bannerInfo);
      message.success("编辑成功");
      this.getGoodsList();
    });
  }
  async getGoodsCategoryList() {
    const data = await goodsCategoryList();
    this.setState({categoryList: [].concat(data)});
  }
  // 切换分页
  private onPageSizeChange(page: number): void {
    this.setState({page},()=>{
      this.state.radioGroup === 1 ? this.getGoodsList() : this.getTableData();
    });
  }
  async getBannerInfo() {
    const data = await bannerInfo();
    this.setState({radioGroup:data.type,bannerInfo:data});
    if(this.formRef){
      const { current } = this.formRef;
      if(current){
        this.formRef.current.setFieldsValue(data);
      }
    }
    if(data.type === 2) {
      this.getTableData();
      this.setState({
        selectedRowKeys:[].concat(data.join_id)
      });
    }else{
      this.getGoodsList();
      this.setState({
        selectedRowKeys:[].concat(data.join_id)
      },()=>{
        console.log(this.state.selectedRowKeys);
      });
    }
  }
  async onSelectChange(selectedRowKeys) {
    this.setState({
      selectedRowKeys,
    });
  }
  async onChangeRadio(e) {
    this.setState({
      radioGroup:e.target.value,
      page:1
    });
    if(e.target.value === 2){
      this.getTableData();
    }else{
      this.getGoodsList();
    }
  }
  async onchangeCategory(value) {
    this.setState({
      goods_category:value[value.length - 1]
    },()=>{
      this.getGoodsList();
    });
  }
  async checkedGoods(e) {
    this.setState({
      selectedRowKeys:[].concat(Number(e.currentTarget.id))
    });
  }
  async searchStudio(value) {
    this.setState({
      studioTitle:value
    },()=>{
      this.getTableData();
    });
  }
  async searchGoods(value) {
    this.setState({
      goodsName:value
    },()=>{
      this.getGoodsList();
    });
  }
  async getTableData(): Promise<void> {
    const query = {
      title:this.state.studioTitle,
      page:this.state.page,
      page_size:this.state.page_size
    };
    const data = await studioList(query);
    this.setState({
      tableList:data.data
    });
  }
  async getGoodsList() {
    const query = {
      name:this.state.goodsName,
      page:this.state.page,
      page_size:this.state.page_size,
      goods_category:this.state.goods_category
    };
    const data = await goodsList(query);
    this.setState({
      goodsList:[].concat(data.data),
      total:data.total
    });
  }
  render(): React.ReactElement {
    const data = {
      type: 'goods'
    };
    const rowSelection:any = {
      type:'radio',
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: this.onSelectChange,
    };
    return (
      <div className="pd20">
        <Form
          name="basic"
          ref={this.formRef}
          initialValues={this.state.bannerInfo}
          onFinish={this.onFinish}
        >
          <Form.Item
            label="商城首页banner图"
            name="image"
            
          >
            <Upload accept="image/*" data={data} className="update"></Upload>
          </Form.Item>
          <Form.Item
            label="设置banner图落地页"
            name="type"
          >
            <Radio.Group onChange={this.onChangeRadio}>
              <Radio value={1}>商品页</Radio>
              <Radio value={2}>直播间</Radio>
            </Radio.Group>
          </Form.Item>
          {this.state.radioGroup === 1 ? (
            <div className="goodsListBox">
              <Form.Item label="商品类目" name="join_id" className="searchBox">
                <div className="searchBox">
                  <Cascader options={this.state.categoryList}
                    onChange={this.onchangeCategory}
                    fieldNames={{value: 'id', label: 'name', children: 'child'}}
                    className="" placeholder="请选择商品类目"/>
                  <Input.Search placeholder="搜索商品名称" className="searchBtn" onSearch={this.searchGoods}/>
                </div>
              </Form.Item>
              <div className="goodsList">
                {this.state.goodsList.map((item)=>{
                  return <div className={item.id === this.state.selectedRowKeys[0] ? "items" : "item"} key={item.id} id={item.id} onClick={this.checkedGoods}>
                    <img src={item.humbnail_img}/>
                    <div className="goods_name">{item.name}{item.id === this.state.selectedRowKeys[0]}</div>
                    <div className="goods_price">
                      <div className="disc_price">￥{item.goods_sku && item.goods_sku[0].original_price / 100}</div>
                      <div className="mkt_price">￥{item.goods_sku && item.goods_sku[0].selling_price / 100}</div>
                    </div>
                  </div>;
                })}
                <Pagination className="pagination" current={ this.state.page } total={this.state.total} defaultPageSize={ this.state.page_size } onChange={this.onPageSizeChange}></Pagination>
              </div> 
            </div> 
          ) : (
            <div className="goodsListBox">
              <Form.Item label="商品类目" name="join_id">
                <Input.Search placeholder="直播间id/标题" className="searchBtn" onSearch={this.searchStudio}/>
                <Table loading={ Loading.getLoadingValue(this) } dataSource={this.state.tableList} rowKey="id" rowSelection={ rowSelection } pagination={ false }>
                  <Table.Column title="直播间id" dataIndex="id" key="id"></Table.Column>
                  <Table.Column title="直播间标题" dataIndex="title" key="title"></Table.Column>
                  <Table.Column title="状态" dataIndex="status" key="status"></Table.Column>
                  <Table.Column title="直播姓名" dataIndex="anchor_name" key="anchor_name"></Table.Column>
                </Table>
              </Form.Item>
              <div className="flex flex-jcend pt20">
                <Pagination current={ this.state.page } total={this.state.total} defaultPageSize={ this.state.page_size } onChange={this.onPageSizeChange}></Pagination>
              </div>
            </div>
          )
          }
          <Form.Item
            label=""
          >
            <Button type="primary" shape="round" htmlType="submit">保存</Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

