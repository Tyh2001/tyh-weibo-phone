<template>
  <div id="loginIndex">
    <h3 class="loginTitle">用户登录</h3>

    <van-form
      :show-error-message="false"
      :show-error="false"
      @submit="onSubmitLogin"
      @failed="onFailed"
    >
      <!-- 用户名 -->
      <van-field
        v-model="user.username"
        name="username"
        label="账号"
        placeholder="账号"
        :rules="[{ required: true, message: '请填写账号' }]"
      />
      <!-- 密码 -->
      <van-field
        v-model="user.password"
        type="password"
        name="password"
        label="密码"
        placeholder="密码"
        :rules="[{ required: true, message: '请填写密码' }]"
      />
      <div style="margin: 16px">
        <van-button
          :disabled="buttonDisabled"
          round
          block
          type="primary"
          size="small"
          native-type="submit"
          >登录</van-button
        >
      </div>
    </van-form>

    <div class="changeRegister">
      <router-link to="/user/register">
        立即注册
        <van-icon name="arrow" />
      </router-link>
    </div>
  </div>
</template>

<script>
import { onUserLogin } from '@/api/user'
export default {
  name: 'loginIndex',
  components: {},
  props: {},
  data () {
    return {
      buttonDisabled: false, // 登录按钮的禁用状态
      user: {
        username: '',
        password: ''
      }
    }
  },
  computed: {},
  watch: {},
  created () { },
  mounted () { },
  methods: {
    // 登录
    async onSubmitLogin (values) {
      // 减少发送请求 如果账号和密码格式不正确则不能发送请求直接返回
      if (
        values.username === '' ||
        values.password === '' ||
        values.username.length < 6 ||
        values.password.length < 8
      ) {
        this.$toast('请输入正确账号和密码')
        return
      }

      this.buttonDisabled = true // 禁用按钮

      const { data } = await onUserLogin(this.$qs.stringify(values))
      console.log(data)

      // 登录成功的操作
      if (data.code === 201) {
        this.$toast(data.msg)
        this.$store.commit('changeUser', data.data)
        this.buttonDisabled = false
        this.$router.push('/')
        return
      }
      this.buttonDisabled = false
      this.$toast(data.msg)
    },
    // 提交表单且验证不通过后触发
    onFailed (errorInfo) {
      this.$toast(errorInfo.errors[0].message)
    }
  }
}
</script>

<style lang='less' scoped>
#loginIndex {
  .loginTitle {
    font-weight: 500;
    color: #333333;
    margin-bottom: 20px;
    margin-top: 30px;
    margin-left: 20px;
  }
  .changeRegister {
    margin-top: 26px;
    width: 80px;
    margin: auto;
    a {
      text-decoration: none;
      color: #333;
      font-size: 15px;
      display: flex;
      align-items: center;
    }
  }
}
</style>
