/* 
  给分类页面添加一个缓存效果
    1 分析缓存逻辑
      1 发送请求之前先判断一下有没有缓存数据
      2 假如没有缓存数据 
        1 直接发送新请求 获取数据
        2 把新输入数据存入缓存中(要存入的数据的格式 key="cates"，{time：存入的时间，data：接口返回值})
      3 有缓存数据
        1 判断数据是否过期
          1 数据已经过期了 重新发送新请求去拿新的数据
          2 数据没有过期 此时 才使用缓存数据
*/

import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 左边商品分类数据
    leftMenuList: [],
    // 右边商品展示数据
    rightGoodsList: [],
    // 商品分类选中的索引
    xuanZhongIndex: 0,
    // 右侧滚动条点击下一个分类时回归顶部
    scrollTop: 0
  },
  /* 定义一个全局接口的返回值方便传值 
     接口的返回值 数组格式
     小程序中不建议把没有必要的数据定义在data中，以为内部会把data中的所有的数据都会传递到视图层 wxml ，容易导致页面特别卡
  */
  Cates: [],
  onLoad () {
    // 获取缓存的数据 用来判断有没有换数据 wx.getStorageSync获取出来的是一个对象
    const cates = wx.getStorageSync("cates");
    // 判断缓存 有没有数据
    if (!cates) {
      // 如果没有数据 cates为空没有数据 就去请求数据
      this.getCategoryList();
    } else {
      // 如果cates有数据 判断数据是否过期 假设过期的时间为10s(Date.now() 生成的时间单位：s)
      if (Date.now() - cates.time > 1000 * 10) {
        //  如果过期了 重新请求数据
        this.getCategoryList();
      } else {
        console.log(cates.data);
        // 没过期 获取缓存数据
        const catesData = cates.data;
        // 给全局数据进行复值
        this.Cates = catesData;
        // 左边商品分类数据
        const leftMenuList = this.Cates.map(v => ({ cat_id: v.cat_id, cat_name: v.cat_name }));
        // 右边商品展示数据
        const rightGoodsList = this.Cates[0].children;
        this.setData({
          leftMenuList,
          rightGoodsList
        })
      }
    }

  },
  async getCategoryList () {
    const res = await request({ url: 'categories' })
    this.Cates = res;
    wx.setStorageSync("cates", { time: Date.now(), data: this.Cates });
    const leftMenuList = this.Cates.map(v => ({ cat_id: v.cat_id, cat_name: v.cat_name }));
    const rightGoodsList = this.Cates[0].children;
    this.setData({
      leftMenuList,
      rightGoodsList
    });
    // request({ url: 'categories' })
    //   .then(res => {
    //     // 把接口的数据 赋值给我们的全局变量
    //     this.Cates = res;
    //     // 把数据存储到 本地存储里面
    //     wx.setStorageSync("cates", { time: Date.now(), data: this.Cates });
    //     // 左边商品分类数据
    //     const leftMenuList = this.Cates.map(v => ({ cat_id: v.cat_id, cat_name: v.cat_name }));
    //     // 右边商品展示数据
    //     const rightGoodsList = this.Cates[0].children;
    //     this.setData({
    //       leftMenuList,
    //       rightGoodsList
    //     })
    //   })
  },
  /* 
  1 给左侧菜单绑定点击事件 
    1 左侧菜单切换选中
    2 获取原数组 循环修改
  2 同时 右侧要显示的内容跟随着改变
    1 获取之前定义好的全局的接口返回值
    2 动态的传递被点击的索引即可  
  */
  handleChange (e) {
    const { index } = e.currentTarget.dataset
    const rightGoodsList = this.Cates[index].children
    this.setData({
      xuanZhongIndex: index,
      rightGoodsList,
      // 控制右侧的滚动条的滚动距离 重新赋值归0
      scrollTop: 0
    })
  }
})