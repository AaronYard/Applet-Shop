// promise 封装 getSetting 获取设置信息（监听 获取地址的 确定，取消等操作）
export const getSetting = () => {
  return new Promise((resolve, reject) => {
    wx.getSetting({
      success(result) {
        resolve(result)
      },
      fail(err) {
        reject(err)
      }
    })
  })
}

// promise 封装 chooseAddress 获取地址
export const chooseAddress = () => {
  return new Promise((resolve, reject) => {
    wx.chooseAddress({
      success(result) {
        resolve(result)
      },
      fail(err) {
        reject(err)
      }
    })
  })
}

// promise 封装 openSetting , 诱导用户打开授权页面重新获取地址
export const openSetting = () => {
  return new Promise((resolve, reject) => {
    wx.openSetting({
      success(result) {
        resolve(result)
      },
      fail(err) {
        reject(err)
      }
    })
  })
}

// promise 封装 showModal , 打开模态框（是否删除）
export const showModal = ({content}) => {
  return new Promise((resolve, reject) => {
    wx.showModal({
      title: '提示',
      content: content,
      success(result) {
        resolve(result)
      },
      fail(err) {
        reject(err)
      }
    })
  })
}

// promise 封装 showToast , 打开提示框（是否选中商品，是否有收货地址）
export const showToast = ({title}) => {
  return new Promise((resolve, reject) => {
    wx.showToast({
      title: title,
      icon: 'none',
      success(result) {
        resolve(result)
      },
      fail(err) {
        reject(err)
      }
    })
  })
}

// promise 封装 login
export const login = () => {
  return new Promise((resolve, reject) => {
    wx.login({
      success(result) {
        resolve(result)
      },
      fail(err) {
        reject(err)
      }
    })
  })
}

// promise 封装 小程序的微信支付    {pay} 为 参数
export const requestPayment = ({pay}) => {
  return new Promise((resolve, reject) => {
    wx.requestPayment({
      ...pay,
      success: (result)=>{
        resolve(result);
      },
      fail: (err)=>{
        reject(err)
      },
    });
  })
}