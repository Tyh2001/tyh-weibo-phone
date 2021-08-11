<template>
  <div id="settingIndex">
    <van-nav-bar title="账号信息设置" left-arrow @click-left="$router.go(-1)" />

    <van-cell-group>
      <van-cell title="头像" is-link value="1" />
      <van-cell title="昵称" is-link :value="userForm.nickname" />
      <van-cell title="个性签名" is-link :value="userForm.autograph" />
      <van-cell title="性别" is-link :value="userForm.gender" />
      <van-cell title="感情状况" is-link :value="userForm.feeling" />
      <van-cell title="职业" is-link :value="userForm.work" />
      <van-cell title="生日" is-link :value="userForm.birthday" />
      <van-cell title="邮箱" is-link :value="userForm.mail" />
    </van-cell-group>
  </div>
</template>

<script>
import { getUserInfo } from '@/api/user'
import { mapState } from 'vuex'
export default {
  name: 'settingIndex',
  components: {},
  props: {},
  data () {
    return {
      userForm: {} // 个人信息
    }
  },
  computed: {
    ...mapState(['userInfo'])
  },
  watch: {},
  created () {
    this.loadgetUserInfo() // 获取用户资料
  },
  mounted () { },
  methods: {
    // 获取用户信息
    async loadgetUserInfo () {
      const { data } = await getUserInfo(this.userInfo.id)
      this.userForm = data.data
    }
  }
}
</script>

<style lang='less' scoped>
</style>
