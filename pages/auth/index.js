import { request } from '../../request/index.js'
import regeneratorRuntime from '../../lib/runtime/runtime';    // 支持 Es7
import { login } from '../../utils/asyncWx.js'

Page({
  // 点击获取授权按钮
  async handleGetUserInfo(e) {
   try {
     // 1. 获取 用户信息
     const { encryptedData, rawData, iv, signature } = e.detail;
     // 2. 获取小程序登录成功后的 code
     const { code } = await login();
     const loginParams = { encryptedData, rawData, iv, signature, code }
     // 3. 发送请求 获取用户的 token
    //  const res = await request({ url: '/users/wxlogin', data: loginParams, method: 'post' })
     const token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo"
    
     // 4. 把 token 存入缓存中， 返回上一个支付页面
     wx.setStorageSync('token', token);
     wx.navigateBack({
       dalta: 1
     })
   } catch(err) {
     console.log(err);
   }
  }
})