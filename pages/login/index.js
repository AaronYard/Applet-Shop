// pages/login/index.js
Page({
  handleGetUserInfo(e) {
    // 获取 用户信息，保存到缓存中
    const {userInfo} = e.detail;
    wx.setStorageSync('userinfo', userInfo)
    // 跳回到原页面
    wx.navigateBack({
      delta: 1
    })
  }
})