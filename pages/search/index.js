/* 
1 输入框绑定 值改变事件 input事件
  1 获取到输入框的值
  2 合法性判断 
  3 检验通过 把输入框的值 发送到后台
  4 返回的数据打印到页面上
2 防抖 （防止抖动） 定时器  节流 
  0 防抖 一般 输入框中 防止重复输入 重复发送请求
  1 节流 一般是用在页面下拉和上拉 
  1 定义全局的定时器id
 */
import { request } from '../../request/index.js'
import regeneratorRuntime from '../../lib/runtime/runtime';    // 支持 Es7

Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods: [],
    isFocus: false,     // 控制按钮显示
    inpValue: ''       // 输入框的值
  },
  timeId: -1,

  // 输入框值改变 就会触发
  handleInput(e) {
    // 1. 获取输入框输入的值
    const {value} = e.detail;
    // 2. 验证合法性
    if(!value.trim()) {
      // 输入的值为空，不合法时, 清空商品数据，按钮隐藏
      this.setData({
        goods: [],
        isFocus: false
      })
      return
    }
    
    this.setData({        // 发送请求，显示 取消按钮
      isFocus: true
    })
    // 发送请求获取数据 (先实现防抖)
    clearTimeout(this.timeId)
    const timeId = setTimeout(() => {
      this.qsearch(value);
    }, 1000)
  },

  // 发送请求获取搜索 数据
  async qsearch(query) {
    const res = await request({ url: '/goods/search', data: {query}})
    console.log(res);
    this.setData({
      goods: res.goods
    })
  },

  // 点击取消按钮
  handleCancel() {
    this.setData({
      goods: [],
      isFocus: false,
      inpValue: ''
    })
  }
})