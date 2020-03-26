// 获取收获地址分析：
/* wx.chooseAddress()获取收获地址
   wx.getSetting() 获取设置权限状态，可监获取收货地址的点击是确定还是取消
   1，确定： 可得到 authSetting scope.address 为 true， 可 直接调用 wx.chooseAddress()获取地址
   2. 不选： 为 undefind， 可直接调用  wx.chooseAddress()获取收获地址
   3. 取消： 诱导用户打开授权页面(wx.openSetting), 用户授权后，再调用 wx.chooseAddress获取地址
   将地址信息存储到本地

   页面加载完毕，获取收货地址  onShow()
*/

import { getSetting, chooseAddress, openSetting, showModal, showToast } from '../../utils/asyncWx.js'
import regeneratorRuntime from '../../lib/runtime/runtime';     // 支持 Es7

Page({
  data: {
    address: {},
    cart: [],
    allChecked: false,
    totalPrice: 0,
    totalNum: 0
  },

  onShow() {
    // 1.获取收货地址
    const address = wx.getStorageSync('address')
    // 1. 获取缓存中的 购物车数据
    const cart = wx.getStorageSync('cart') || []
    // 1. 计算全选 使用every() 方法，遍历每个数据，全部为 true 则返回 true; 空数组调用 every,返回 true
    // const allChecked = cart.length > 0 ? cart.every(v => v.checked === true) : false
    this.setData({ address })
    this.setCart(cart)
  },

  // 点击收获地址
  async handleChooseAddress() {
    try {
      // 1. 获取权限状态
      const res1 = await getSetting()
      const scopeAddress = res1.authSetting['scope.address']
      // 2. 判断权限状态
      if (scopeAddress === false) {
        // 4. 诱导用户打开授权
        await openSetting();
      }
      // 3.调用获取收获地址的 Api
      let address = await chooseAddress()
      address.all = address.provinceName + address.cityName + address.countyName + address.detailInfo;
      // 4.将地址保存到本地
      wx.setStorageSync('address', address);
    } catch (err) {
      console.log(err);
    }
  },

  // 监听 商品的选中切换
  handleItemChange(e) {
    // 1.获取修改商品的 自定义id
    const goods_id = e.currentTarget.dataset.id
    // 2. 获取购物车数组
    let {cart} = this.data
    // 3. 找到被修改的商品对象
    let index = cart.findIndex(v => v.goods_id === goods_id)
    // 4.改变商品的选中状态
    cart[index].checked = !cart[index].checked
    
    this.setCart(cart)
   
  },

  // 封装出来 （设置购物车状态时 重新计算底部工具栏数据 全选 总价格 总数量, 以及缓存到本地）
  setCart(cart) {
    let allChecked = true
    // 1.总价格 总数量
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
      if (v.checked) {
        totalPrice += v.goods_price * v.num
        totalNum += v.num
      } else {
        allChecked = false
      }
    })
    // 判断 cart 数组是否为空
    allChecked = cart.length !== 0 ? allChecked : false;
    // 2.保存到 data 中
    this.setData({
      cart,
      allChecked,
      totalPrice,
      totalNum
    })
    wx.setStorageSync("cart", cart);
  },

  // 监听 全选按钮的点击
  handleItemAllCheck() {
    // 1. 获取 data 中的数据
    let {cart, allChecked} = this.data;
    // 2. 状态取反
    allChecked = !allChecked;
    // 3. 循环修改数组 cart 中的商品状态
    cart.forEach(v => v.checked = allChecked);
    // 4. 将数据保存到 data 和 缓存中，重新计算底部工具栏数据
    this.setCart(cart)
  },

  // 监听 +— 按钮，改变商品数量
  async handleItemNumEdit(e) {
    // 1 获取传递过来的参数 
    const { operation, id } = e.currentTarget.dataset;
    // 2 获取购物车数组
    let { cart } = this.data;
    // 3 找到需要修改的商品的索引
    const index = cart.findIndex(v => v.goods_id === id);
    // 4 判断是否要执行删除
    if (cart[index].num === 1 && operation === -1) {
      // 4.1 弹窗提示
      const res = await showModal({ content: "您是否要删除？" });
      if (res.confirm) {
        cart.splice(index, 1);
        this.setCart(cart);
      }
    } else {
      // 4  进行修改数量
      cart[index].num += operation;
      // 5 设置回缓存和data中
      this.setCart(cart);
    }
  },

  // 监听支付按钮点击
  async handlePay() {
    // 1. 获取收获地址 和 总数量
    const {address, totalNum} = this.data
    // 2. 判断 收获地址
    if(!address.userName) {
      await showToast({title: '您还没有选择收获地址'})
      return;
    }
    // 3. 判断 选中商品
    if(totalNum === 0) {
      await showToast({title: '您还没有选购商品'})
      return;
    }
    // 4. 跳转都支付页面
    wx.navigateTo({
      url: '/pages/pay/index'
    });
  }
})