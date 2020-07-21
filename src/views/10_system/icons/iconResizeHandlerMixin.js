export default {
  beforeCreate() {
    // 设置页面的name 页面id，和router中的name需要一致，作为缓存
    this.$options.name = this.$route.name
  },
  beforeMount() {
    window.addEventListener('resize', this.resizeHandler)
  },
  mounted() {
    this.dataJson.tabHeightStyle = 'height:' + this.setUIheight() + 'px'
  },
  created() {
  },
  updated() {
    this.dataJson.tabHeightStyle = 'height:' + this.setUIheight() + 'px'
  },
  methods: {
    resizeHandler() {
      this.dataJson.tabHeightStyle = 'height:' + this.setUIheight() + 'px'
    },
    setUIheight() {
      try {
        // 定义高度
        const elementHeight = document.documentElement.clientHeight - 85
        // 获取所有的ref，主要判断minus的refs
        const listRefsNames = Object.keys(this.$refs).map((key) => {
          return this.$refs[key]
        })
        let val = 0
        for (let i = 0; i < Object.keys(this.$refs).length; i++) {
          if (Object.keys(this.$refs)[i].indexOf('minus') >= 0) {
            val = val + listRefsNames[i].$el.offsetHeight
          }
        }
        let rtnVal = elementHeight - val - 32
        // 判断是否是弹出框
        if (this.meDialogStatus) {
          rtnVal = rtnVal - 170
        }
        return rtnVal
      } catch (error) {
        console.log('mixin error')
      }
    }
  }
}
