import { request } from '../../request/index.js'
import regeneratorRuntime from '../../lib/runtime/runtime';    // 支持 Es7

Page({
  data: {
    tabs: [
      {
        id: 0,
        value: '综合',
        isActive: true
      },
      {
        id: 1,
        value: '销量',
        isActive: false
      },
      {
        id: 2,
        value: '价格',
        isActive: false
      },
    ],
    goodsList: [],
  },
  // 接口要的参数
  QueryParams: {
    query: "",
    cid: "",
    pagenum: 1,         // 页数
    pagesize: 10
  },
  
  // 总页数
  totalPages: 1,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.QueryParams.cid = options.cid || "";            // 获取传递过来的 cid
    this.QueryParams.query = options.query || "";
    this.getGoodsList();
  },

  // 获取商品列表数据
  async getGoodsList() {
    const res = await request({ url: "/goods/search", data: this.QueryParams });
    // 获取商品 总条数
    const total = res.total
    // 获取总页数
    this.totalPages = Math.ceil(res.total / this.QueryParams.pagesize);
    
    this.setData({
      // 拼接数组
      goodsList: [...this.data.goodsList,...res.goods]
    })
    // 停止下拉刷新图标显示
    wx.stopPullDownRefresh()
  },

  // 标题点击事件， 接收从 子组件传过来的参数
  handleTabsItemChange(e) {
    console.log(e);
    // 1. 获取点击的标题索引
    const {index} = e.detail;
    // 2. 修改源数组 Tabs 
    let {tabs} = this.data
    tabs.forEach((v, i) => i===index ? v.isActive=true : v.isActive=false);
    // 3. 重新赋值 Tabs
    this.setData({
      tabs
    })
  },

  // 页面上滑 滚动条触底事件(上拉加载更多)
  onReachBottom() {
    if(this.QueryParams.pagenum >= this.totalPages) {
      wx.showToast({title: '没有下一页数据了',});
    } else{
      // 当前页小于 总页数，重新发送请求
      this.QueryParams.pagenum++;
      this.getGoodsList()
    }
  },

  // 下拉刷新事件
  onPullDownRefresh() {
    // 1. 重置数据数组
    this.setData({
      goodsList: []
    })
    // 2. 将页面重置为 1
    this.QueryParams.pagenum = 1
    // 3. 重新发送请求
    this.getGoodsList();
  }

 
})