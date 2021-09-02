<template>
  <div>
    <router-view />

    <van-tabbar v-model="active" route>
      <van-tabbar-item to="/" icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item to="/release" icon="search">发布</van-tabbar-item>
      <van-tabbar-item
        :to="userInfo ? '/my/' + userInfo.id : ''"
        icon="manager-o"
      >
        我
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: '',
  components: {},
  props: {},
  data () {
    return {
      active: 0
    }
  },
  computed: {
    ...mapState(['userInfo'])
  },
  watch: {},
  created () { },
  mounted () { },
  methods: {}
}
</script>

<style lang='less' scoped>
</style>
