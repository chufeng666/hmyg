// components/Tabs/Tabs.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tabs: {
      type: Array,
      value: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },
  methods: {
    handleChange (e) {
      const { index } = e.currentTarget.dataset
      // 触发父组件的自定义事件
      this.triggerEvent("itenChange", { index })
    }
  }

})
