/* 实现功能
  1 上滑页面 滚动条触底 加载下一页数据功能
    1 onReachBottom 页面触底事件
    2 先判断 有没有下一页数据
      1 当前的页码 pagenum 和 总页数 比较
        总页数 = Math.ceil(总条数(Totalpage) / 页容量)
        当前的页码 >= 总页数 没有下一页数据 否则就相反
  2 在onReachBottom进行判断有没有下一页数据
    1 有数据
      1 页码 pagenum++
      2 直接发送请求回去数据
      3 数据回来后 对商品数组进行拼接 而不是全部替换
  3 下啦刷新
    1 用户往下滑动页面的时候 开启下啦刷新效果
      页面的json文件 加入一个允许下啦属性 "enablePullDownRefresh":true
    2 下啦刷新事件 onPullDownRefresh
    3 重置页面
      1 重置页码 pagenum=1
      2 重置商品数组 data 中的商品数组 进行重置[]
      3 重新发送气你供求
      4 数据请求回来后 手动关闭页面 页面的下啦刷新效果  
  4 异步请求的正在等待效果
    1 正在等待的效果 wx.showLoading
    2 这段代码放在request里面 异步请求之前在请求之前执行
      1 请求成功后 就关闭 wx.hideLoading()
*/

import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({
  data: {
    tabs: [
      { id: 0, title: "综合", isActive: true },
      { id: 1, title: "效量", isActive: false },
      { id: 2, title: "价格", isActive: false }
    ],
    // 渲染页面的数组
    goodsList: []
  },
  // 接口用的参数
  QueryParams: {
    // 搜素的关键字
    query: '',
    // 分类id
    cid: '',
    // 页面
    pagenum: 1,
    // 页容量
    pagesize: 10
  },
  // 设置一个全局总页数变量方便调用
  Totalpage: 1,
  // 页面开始加载就触发
  // 它的形参可以获取到url上的参数
  onLoad (options) {
    this.QueryParams.cid = options.cid
    this.getGoodsList()
  },
  // 获取商品列表数据的请求
  async getGoodsList (e) {
    //  await会等带request异步请求完毕成功之后在触发下一行代码
    const res = await request({ url: 'goods/search', data: this.QueryParams })
    // console.log(res);
    this.Totalpage = Math.ceil(res.total / this.QueryParams.pagesize);
    this.setData({
      goodsList: [...this.data.goodsList, ...res.goods]
    })
    wx.stopPullDownRefresh();
    // request({ url: 'goods/search', data: this.QueryParams })
    //   .then(res => {
    //     this.Totalpage = Math.ceil(res.total / this.QueryParams.pagesize);
    //     // console.log(this.Totalpage);
    //     this.setData({
    //       // 拼接数组 将开始的页容量数据和向下刷新的新页容量数据拼接一起
    //       goodsList: [...this.data.goodsList, ...res.goods]
    //     })
    //     // 关闭页面的下啦刷新效果
    //     /* 
    //       1 有些框架 一些组件没有开启 就有关闭的可能 会报错
    //       2 有些框架 一些组件没有开启 就有关闭的可能 不会会报错 ！！！
    //       看框架决定加关闭页面的下啦刷新效果 
    //       1. 会报错要判断组件是否开启
    //       2. 加的位置也是看逻辑判断
    //     */
    //     wx.stopPullDownRefresh();
    //   })
  },
  // tabs 子组件传值的时间
  handleItemChange (e) {
    const { index } = e.detail
    console.log(index);

    let { tabs } = this.data
    tabs.forEach((v, i) => { i === index ? v.isActive = true : v.isActive = false })
    this.setData({ tabs })
  },
  // 页面上啦 滚动条触底事件
  onReachBottom () {
    if (this.QueryParams.pagenum > this.Totalpage) {
      // 弹窗 wx.showToast
      wx.showToast({
        title: '没有下一数据',
        icon: 'none',
      });
    } else {
      this.QueryParams.pagenum++;
      this.getGoodsList();
    }
  },
  onPullDownRefresh () {
    this.QueryParams.pagenum = 1;
    this.setData({
      goodsList: []
    });
    this.getGoodsList();
  }
})