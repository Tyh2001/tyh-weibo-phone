<template>
  <div id="passIndex">
    <van-nav-bar title="修改密码" left-arrow @click-left="$router.go(-1)" />

    <van-form
      :show-error-message="false"
      :show-error="false"
      @submit="SaveDataNewPass"
      @failed="failedPassword"
    >
      <!-- 原始密码 -->
      <van-field
        v-model="changePass.oldPass"
        type="password"
        name="oldPass"
        label="原始密码"
        placeholder="原始密码"
        :rules="[{ required: true, message: '请填写原始密码' }]"
      />

      <!-- 新密码 -->
      <van-field
        v-model="changePass.newPass1"
        type="password"
        name="newPass1"
        label="新密码"
        placeholder="请输入新密码"
        :rules="[{ required: true, message: '请填写密码' }]"
      />

      <!-- 再次输入密码 -->
      <van-field
        v-model="changePass.newPass2"
        type="password"
        name="newPass2"
        label="确认密码"
        placeholder="确认新密码"
        :rules="[{ required: true, message: '请再次填写密码' }]"
      />

      <div style="margin: 16px">
        <van-button round block native-type="submit" type="primary" size="small"
          >修改密码</van-button
        >
      </div>
    </van-form>
  </div>
</template>

<script>
import { changeUserPass } from '@/api/user'
import { mapState } from 'vuex'
export default {
  name: 'passIndex',
  components: {},
  props: {},
  data () {
    return {
      // 修改密码
      changePass: {
        oldPass: '',
        newPass1: '',
        newPass2: ''
      }
    }
  },
  computed: {
    ...mapState(['userInfo'])
  },
  watch: {},
  created () { },
  mounted () { },
  methods: {
    // 修改密码
    async SaveDataNewPass (values) {
      // 表单验证
      if (
        (values.oldPass.length < 8 || values.oldPass.length > 20) &&
        (values.newPass1.length < 8 || values.newPass1.length > 20) &&
        (values.newPass2.length < 8 || values.newPass2.length > 20)) {
        this.$notify({ type: 'danger', message: '密码长度需在8到20个字符', duration: 1300 })
        return
      }
      if (values.newPass1 !== values.newPass2) {
        this.$notify({ type: 'danger', message: '两次密码输入不一致', duration: 1300 })
        return
      }

      // 校验全部合格 发送请求
      const { data } = await changeUserPass(this.$qs.stringify(
        {
          oldPass: this.changePass.oldPass,
          newPass: this.changePass.newPass2
        }
      ), this.userInfo.id)

      // 更新失败
      if (data.code !== 201) {
        this.$notify({ type: 'danger', message: data.msg, duration: 1300 })
        return
      }

      // 更新成功
      this.$notify({ type: 'success', message: data.msg + '，请退出重新登录', duration: 1300 })
      this.$store.commit('outLogin')
      this.$router.push('/')
    },
    // 当表单验证不通过时候触发
    failedPassword (errorInfo) {
      this.$notify({ type: 'danger', message: errorInfo.errors[0].message, duration: 1300 })
    }
  }
}
</script>

<style lang='less' scoped>
</style>
