<template>
  <div>
    <router-view />

    <van-tabbar v-model="active" route>
      <van-tabbar-item to="/" icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item icon="search">标签</van-tabbar-item>
      <van-tabbar-item icon="friends-o">标签</van-tabbar-item>
      <van-tabbar-item to="/setting" icon="setting-o">我</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  name: '',
  components: {},
  props: {},
  data () {
    return {}
  },
  computed: {},
  watch: {},
  created () { },
  mounted () { },
  methods: {}
}
</script>

<style lang='less' scoped>
</style>
