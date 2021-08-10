<template>
  <div id="registerIndex">
    <h3 class="loginTitle">注册账号</h3>

    <van-form
      :show-error-message="false"
      :show-error="false"
      @submit="onSubmitRegister"
      @failed="onFailed"
    >
      <!-- 账号 -->
      <van-field
        v-model="user.username"
        name="username"
        label="账号"
        placeholder="请输入账号"
        :rules="registerRule.userNameRule"
      />

      <!-- 密码 -->
      <van-field
        v-model="user.password"
        type="password"
        name="password"
        label="密码"
        placeholder="请输入密码"
        :rules="registerRule.passWordRule"
      />

      <!-- 再次输入密码 -->
      <van-field
        v-model="user.password2"
        type="password"
        name="password2"
        label="确认密码"
        placeholder="请再次输入密码"
        :rules="registerRule.passWordRule2"
      />

      <!-- 邮箱 -->
      <van-field
        v-model="user.mail"
        name="mail"
        label="邮箱"
        placeholder="请输入邮箱"
        :rules="registerRule.mailRule"
      />

      <!-- 验证码 -->
      <div id="captcha_form_item">
        <van-field
          v-model="user.captcha"
          name="captcha"
          label="验证码"
          placeholder="请输入验证码"
          :rules="registerRule.captchaRule"
        />
        <img
          class="captcha_img"
          :src="captchaImgURL"
          alt="验证码"
          @click="changeCaptchaImg"
        />
      </div>

      <!-- 注册按钮 -->
      <div style="margin: 16px">
        <van-button
          :disabled="registerDisabled"
          round
          block
          type="warning"
          size="small"
          native-type="submit"
          >立即注册</van-button
        >
      </div>
    </van-form>

    <!-- 返回登录 -->
    <div class="changeLogin">
      <router-link to="/user/login">
        返回登录
        <van-icon name="arrow" />
      </router-link>
    </div>
  </div>
</template>

<script>
import { randomNum } from '@/utils/randomNum'
import { onRegister } from '@/api/user'
export default {
  name: 'registerIndex',
  components: {},
  props: {},
  data () {
    return {
      registerDisabled: false, // 按钮禁用状态
      captchaCode: '', // 验证码随机数
      user: {
        username: '',
        password: '',
        password2: '',
        mail: '', // 邮箱
        captcha: '' // 验证码
      },
      // 表单验证方法
      registerRule: {
        // 账号
        userNameRule: [
          { required: true, message: '请输入账号' },
          { pattern: /^(?![^0-9a-zA-Z]+$)(?!\D+$).{6,12}$/, message: '账号长度需在6到12个字符' }
        ],
        // 第一遍密码
        passWordRule: [
          { required: true, message: '请输入密码' },
          { pattern: /^(?![^0-9a-zA-Z]+$).{6,12}$/, message: '密码长度需在8到20个字符' }
        ],
        // 第二遍密码
        passWordRule2: [
          { required: true, message: '请输入再次输入密码' }
        ],
        // 邮箱
        mailRule: [
          { required: true, message: '请输入邮箱' },
          { pattern: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/, message: '邮箱格式不正确' }
        ],
        // 验证码
        captchaRule: [
          { required: true, message: '请输入验证码' },
          { pattern: /^(?![^0-9]+$).{2}$/, message: '请输入正确验证码' }
        ]
      }
    }
  },
  computed: {
    // 返回随机验证码
    captchaImgURL () {
      return require(`./images/captcha_${this.captchaCode}.png`)
    }
  },
  watch: {},
  created () {
    // 获取随机数
    this.captchaCode = randomNum(15, 1)
  },
  mounted () { },
  methods: {
    // 注册账号
    async onSubmitRegister (values) {
      this.registerDisabled = true
      values.captchaCode = this.captchaCode // 传递随机数
      const { data } = await onRegister(this.$qs.stringify(values))

      // 根据后端返回数据判断用户登录
      if (data.code !== 201) {
        this.$toast(data.msg)
        // 如果验证码错误则重新加载一个新的验证码图片
        if (data.msg === '验证码错误') {
          this.captchaCode = randomNum(15, 1)
        }
        this.registerDisabled = false
        return
      }

      this.registerDisabled = false
      this.$toast('注册成功')
      this.$router.push('/user/login')
    },
    // 点击切换验证码图片
    changeCaptchaImg () {
      this.captchaCode = randomNum(15, 1)
    },
    // 提交表单且验证不通过后触发
    onFailed (errorInfo) {
      if (errorInfo.values.password !== errorInfo.values.password2) {
        this.$toast('两次密码输入不一致')
        return
      }
      this.$toast(errorInfo.errors[0].message)
    }
  }
}
</script>

<style lang='less' scoped>
#registerIndex {
  .loginTitle {
    font-weight: 500;
    color: #333333;
    margin-bottom: 20px;
    margin-top: 30px;
    margin-left: 20px;
  }
  // 验证码输入框
  #captcha_form_item {
    width: 100%;
    display: flex;
    .captcha_img {
      width: 140px;
      margin-right: 15px;
    }
  }
  .changeLogin {
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
