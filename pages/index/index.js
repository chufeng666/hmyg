/* 引入封装过后的接口文档 */
import { request } from "../../request/index.js";
Page({

  data: {
    // 轮播图的数据
    swiperList: [],
    // 分类导航数据
    navCateList: [],
    // 楼层商品数据
    floorList: []
  },
  // 页面开始加载触发事件
  onLoad () {
    this.getSwiperList();
    this.getNavCateList();
    this.getFloorList();
  },
  // 获取轮播图的数据
  getSwiperList () {
    /* 回调地狱！！！ */
    request({ url: 'home/swiperdata' })
      .then(res => {
        this.setData({
          swiperList: res
        })
      })
  },
  // 获取分类导航的数据
  getNavCateList () {
    request({ url: 'home/catitems' })
      .then(res => {
        this.setData({
          navCateList: res
        })
      })
  },
  // 获取楼层商品的数据
  getFloorList () {
    request({ url: 'home/floordata' })
      .then(res => {
        this.setData({
          floorList: res
        })
      })
  }
})