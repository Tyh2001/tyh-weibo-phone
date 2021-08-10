<template>
  <div id="honeIndex">
    <van-nav-bar
      title="首页"
      left-text="返回"
      right-text="按钮"
      left-arrow
      @click-left="onClickLeft"
      @click-right="onClickRight"
    />

    <van-tabs v-model="active">
      <van-tab title="全部">全部</van-tab>
      <van-tab title="关注">关注</van-tab>
    </van-tabs>
  </div>
</template>

<script>
export default {
  name: 'honeIndex',
  components: {},
  props: {},
  data () {
    return {
      active: 2
    }
  },
  computed: {},
  watch: {},
  created () { },
  mounted () { },
  methods: {
    onClickLeft () {
      this.$toast('返回')
    },
    onClickRight () {
      this.$toast('按钮')
    }
  }
}
</script>

<style lang='less' scoped>
</style>
