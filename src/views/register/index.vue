<template>
  <div id="registerIndex">
    <h3 class="loginTitle">注册账号</h3>

    <van-form
      :show-error-message="false"
      :show-error="false"
      @submit="onSubmitRegister"
    >
      <!-- 账号 -->
      <van-field
        v-model="user.username"
        name="username"
        label="账号"
        placeholder="请输入账号"
        :rules="[{ required: true, message: '请填写账号' }]"
      />

      <!-- 密码 -->
      <van-field
        v-model="user.password"
        type="password"
        name="password"
        label="密码"
        placeholder="请输入密码"
        :rules="[{ required: true, message: '请填写密码' }]"
      />

      <!-- 再次输入密码 -->
      <van-field
        v-model="user.password2"
        type="password"
        name="mail"
        label="确认密码"
        placeholder="请再次输入密码"
        :rules="[{ required: true, message: '请再次输入密码' }]"
      />

      <!-- 邮箱 -->
      <van-field
        v-model="user.mail"
        name="mail"
        label="邮箱"
        placeholder="请输入邮箱"
        :rules="[{ required: true, message: '请填写邮箱' }]"
      />

      <!-- 验证码 -->
      <div id="captcha_form_item">
        <van-field
          v-model="user.captcha"
          name="captcha"
          label="验证码"
          placeholder="请输入验证码"
          :rules="[{ required: true, message: '请填写验证码' }]"
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
      values.captchaCode = this.captchaCode
      const { data } = await onRegister(this.$qs.stringify(values))
      console.log(data)
    },
    // 点击切换验证码图片
    changeCaptchaImg () {
      this.captchaCode = randomNum(15, 1)
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
