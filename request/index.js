// 请求接口的封装
//  同时发送ajax请求的次数
let ajaxTimes = 0;
export const request = (params) => {
  ajaxTimes++;
  // 页面加载前显示的图标
  wx.showLoading({
    title: "加载中"
  });
  // 公共接口前缀
  const baseUrl = "https://api.zbztb.cn/api/public/v1/"
  return new Promise((resolve, reject) => {
    wx.request({
      ...params,
      url: baseUrl + params.url,
      success: (result) => {
        resolve(result.data.message)
      },
      fail: (err) => {
        reject(err)
      },
      // 无论成功或者失败都执行
      complete: () => {
        ajaxTimes--;
        if (ajaxTimes === 0) {
          // 最后一个请求回来了
          // 关闭 正在等待图标
          wx.hideLoading();
        }
      }
    });
  })
}