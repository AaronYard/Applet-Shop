
// 同时发送异步代码的次数 （解决同时多次异步请求显示多个加载中的问题）
let ajaxTimes = 0;

// 封装 Promise 解决回调地狱问题
export const request = (params) => {
  // 判断 url中是否带有 /my/ 请求的是私有的路径 带上 header token
  let header = { ...params.header};
  if (params.url.includes('/my/')) {
    // 拼接header 带上token
    header["Authorization"] = wx.getStorageSync('token')
  }
  ajaxTimes++;
  // 显示加载中 效果
  wx.showLoading({
    title: "加载中",
    mask: true
  });
  // 定义公告的 url
  const baseUrl = 'https://api-hmugo-web.itheima.net/api/public/v1';
  return new Promise((resolve, reject) => {
    
    wx.request({
      ...params,
      header: header,
      url: baseUrl + params.url,      // Url 拼接
      success: (result) => {
        resolve(result.data.message);     // 后面获取想要的数据时可直接 获取，不用一层层下去
      },
      fail: (err) => {
        reject(err);
      },
      complete() {
        ajaxTimes--;
        if(ajaxTimes===0) {
          wx.hideLoading()      // 请求次数为 0 时关闭加载中 图标
        }
      }
    });
  })
}
