<template>
  <div id="settingIndex">
    <van-nav-bar title="账号信息设置" left-arrow @click-left="$router.go(-1)" />

    <van-cell-group>
      <input
        type="file"
        ref="file_input"
        accept="image/*"
        @change="onChangeFileInp"
        hidden
      />
      <!-- 头像 -->
      <van-cell
        title="头像"
        value="内容"
        is-link
        center
        @click="$refs.file_input.click()"
      >
        <div>
          <van-image
            round
            :src="userPhotoAvatar"
            @click="$refs.file_input.click()"
          />
        </div>
      </van-cell>

      <!-- 昵称 -->
      <van-cell
        center
        title="昵称"
        is-link
        :value="userForm.nickname"
        @click="upPopupUserNickname = true"
      />

      <!-- 个性签名 -->
      <van-cell
        center
        title="个性签名"
        is-link
        :value="userForm.autograph"
        @click="upPopupUserAutograph = true"
      />

      <!-- 性别 -->
      <van-cell
        center
        title="性别"
        is-link
        :value="userForm.gender"
        @click="upPopupUserGender = true"
      />

      <!-- 感情状况 -->
      <van-cell
        center
        title="感情状况"
        is-link
        :value="userForm.feeling"
        @click="upPopupUserFeeling = true"
      />

      <!-- 职业 -->
      <van-cell
        center
        title="职业"
        is-link
        :value="userForm.work"
        @click="upPopupUserWork = true"
      />

      <!-- 生日 -->
      <van-cell
        center
        title="生日"
        is-link
        :value="userForm.birthday"
        @click="upPopupUserBirthday = true"
      />

      <!-- 邮箱 -->
      <van-cell
        center
        title="邮箱"
        is-link
        :value="userForm.mail"
        @click="upPopupUserMail = true"
      />

      <!-- 城市 -->
      <!-- <van-cell
        center
        title="城市"
        is-link
        :value="userForm.city"
        @click="upPopupUserCity = true"
      /> -->
    </van-cell-group>

    <!-- 上传头像的弹窗 -->
    <van-popup
      class="CropperImgPopupBox"
      v-model="upPopupUserPhoto"
      position="bottom"
      :style="{ height: '100%' }"
      @opened="dialogOpened"
      @closed="dialogClosed"
    >
      <div class="cropper_box">
        <img class="cropper_img" ref="cropper_img" :src="UploadfileImgUrl" />
      </div>

      <van-nav-bar
        class="ConfirmuploadBar"
        left-text="取消"
        right-text="确认"
        @click-left="CanceluploadingAvatar"
        @click-right="ToUploadPhoto"
      />
    </van-popup>

    <!-- 更改昵称的弹出框 -->
    <van-popup
      position="bottom"
      :style="{ height: '100%' }"
      v-model="upPopupUserNickname"
    >
      <van-nav-bar
        title="昵称"
        right-text="保存"
        left-arrow
        @click-left="upPopupUserNickname = false"
        @click-right="upDataNickname"
      />

      <van-field
        v-model="originalUserInfo.nickname"
        rows="1"
        autosize
        type="textarea"
        placeholder="请输入昵称"
        :rules="[{ required: true, message: '请填写用户名' }]"
      />
    </van-popup>

    <!-- 更改个性签名的弹出框 -->
    <van-popup
      position="bottom"
      :style="{ height: '100%' }"
      v-model="upPopupUserAutograph"
    >
      <van-nav-bar
        title="个性签名"
        right-text="保存"
        left-arrow
        @click-left="upPopupUserAutograph = false"
        @click-right="upDataAutograph"
      />
      <van-field
        v-model="originalUserInfo.autograph"
        rows="1"
        autosize
        type="textarea"
        placeholder="请输入个性签名"
      />
    </van-popup>

    <!-- 更改性别的弹出框 -->
    <van-popup position="bottom" v-model="upPopupUserGender">
      <van-picker
        title="性别"
        :show-toolbar="upPopupUserGender"
        :columns="genderList"
        @confirm="onConfirmGender"
        @cancel="closePopup('upPopupUserGender')"
      />
    </van-popup>

    <!-- 更改感情状况的弹出框 -->
    <van-popup position="bottom" v-model="upPopupUserFeeling">
      <van-picker
        title="感情状况"
        :show-toolbar="upPopupUserFeeling"
        :columns="feelingList"
        @confirm="onConfirmFeeling"
        @cancel="closePopup('upPopupUserFeeling')"
      />
    </van-popup>

    <!-- 更改职业的弹出框 -->
    <van-popup position="bottom" v-model="upPopupUserWork">
      <van-picker
        title="职业"
        :show-toolbar="upPopupUserWork"
        :columns="workList"
        @confirm="onConfirmWork"
        @cancel="closePopup('upPopupUserWork')"
      />
    </van-popup>

    <!-- 更改生日的弹出框 -->
    <van-popup position="bottom" v-model="upPopupUserBirthday">
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        title="选择生日"
        :min-date="minDate"
        :max-date="maxDate"
        @confirm="confirmBirthday"
        @cancel="closePopup('upPopupUserBirthday')"
      />
    </van-popup>

    <!-- 更改邮箱的弹出框 -->
    <van-popup
      position="bottom"
      :style="{ height: '100%' }"
      v-model="upPopupUserMail"
    >
      <van-nav-bar
        title="邮箱"
        right-text="保存"
        left-arrow
        @click-left="upPopupUserMail = false"
        @click-right="upDataMail"
      />
      <van-field
        v-model="originalUserInfo.mail"
        rows="1"
        autosize
        type="textarea"
        placeholder="请输入邮箱"
      />
    </van-popup>
  </div>
</template>

<script>
import { getUserInfo, uploadUserPhoto, changeUserInfo } from '@/api/user'
import { mapState } from 'vuex'
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'
import url from '@/utils/url'
export default {
  name: 'settingIndex',
  components: {},
  props: {},
  data () {
    return {
      /**
       * 这里是文本框输入的内容
       * 所以不能直接绑定获取到用户信息的值
       * 因为直接绑定的话就算没有点击确定提交的时候
       * 切换到其他信息的修改的时候 同样会修改之前不想修改的内容
       * 这里仅限于：昵称、个性签名、邮箱
       */
      originalUserInfo: {
        nickname: '',
        autograph: '',
        mail: ''
      },
      minDate: new Date(1980, 0, 1), // 最小时间
      maxDate: new Date(2025, 10, 1), // 最大时间
      currentDate: new Date(2000, 0, 1), // 用来同步当前的时间
      genderList: ['男', '女', '保密'], // 性别列表
      feelingList: ['单身', '已婚', '订婚', '暧昧中', '求交往', '暗恋中', '分居', '离异', '保密'], // 感情状况
      workList: ['计算机/互联网/通信', '生产/工艺/制造', '金融/银行/投资/保险', '商业/服务业/个体经营', '文化/广告/传媒', '娱乐/艺术/表演', '律师/法务', '教育/培训', '公务员/行政/事业单位', '演员/歌手', '自由职业', '模特', '空姐', '学生', '其他'], // 工作列表
      upPopupUserPhoto: false, // 上传头像的弹框
      upPopupUserNickname: false, // 更改昵称的弹出框
      upPopupUserAutograph: false, // 更改个性签名的弹出框
      upPopupUserGender: false, // 更改性别的弹出框
      upPopupUserFeeling: false, // 更改感情状况的弹出框
      upPopupUserWork: false, // 更改职业的弹出框
      upPopupUserBirthday: false, // 更改生日的弹出框
      upPopupUserMail: false, // 更改邮箱的弹出框
      upPopupUserCity: false, // 更改城市的弹出框
      UploadfileImgUrl: '', // 上传文件的图片路径
      userForm: {} // 个人信息
    }
  },
  computed: {
    ...mapState(['userInfo']),
    // 用户头像地址
    userPhotoAvatar () {
      if (this.userForm.avatar) {
        return `${url}/userPhoto/${this.userForm.avatar}`
      }
      return ''
    }
  },
  watch: {},
  created () {
    this.loadgetUserInfo() // 获取用户资料
  },
  mounted () { },
  methods: {
    // 提示消息函数
    notifyShow (type, text) {
      this.$notify({ type: type, message: text, duration: 1300 })
    },
    // 获取用户信息
    async loadgetUserInfo () {
      const { data } = await getUserInfo(this.userInfo.id)
      this.userForm = data.data
    },
    // 当上传文件被改变时候 获取图片路径 展示裁切器对话框
    onChangeFileInp () {
      // 获取到上传图片的路径
      this.UploadfileImgUrl = URL.createObjectURL(this.$refs.file_input.files[0])
      this.upPopupUserPhoto = true // 展示对话框
    },
    // 当头像裁切器对话框完全展示时候的回调 获取对话框中的 img 标签 并初始化裁切器
    dialogOpened () {
      const image = this.$refs.cropper_img // 获取到对话框中的 img 标签
      this.cropper = new Cropper(image, {
        aspectRatio: 1 / 1, // 裁切框的比例
        viewMode: 1, // 裁切框不能移出图片范围
        // dragMode: 'none', // 背景画布禁止移动
        background: false
      })
    },
    // 取消上传头像
    CanceluploadingAvatar () {
      this.notifyShow('danger', '已取消上传')
      this.upPopupUserPhoto = false
    },
    // 确认上传头像
    ToUploadPhoto () {
      this.$toast.loading({ message: '上传中...', forbidClick: true, duration: 0 })
      // blob 为裁切的结果图片
      this.cropper.getCroppedCanvas().toBlob((blob) => {
        const formData = new FormData()

        // 这里第三个参数为图片后缀名
        formData.append('photo', blob, '.jpg')

        uploadUserPhoto(formData, this.userInfo.id).then(res => {
          this.userForm.avatar = res.data.data.url // 更新头像
          this.upPopupUserPhoto = false // 关于对话框
          this.$toast.clear()
          this.$toast('上传头像成功')
        })
      })
    },
    // 当对话框完全关闭的时候
    dialogClosed () {
      // 销毁裁切器
      this.cropper.destroy()
      this.$refs.file_input.value = ''
    },
    // 更改昵称 当点击确定按钮的时候
    async upDataNickname () {
      const nickName = this.originalUserInfo.nickname

      // 如果格式不符合的时候
      if (nickName === '' || nickName < 3 || nickName > 15) {
        this.notifyShow('danger', '昵称长度在3到15个字符')
        return
      }
      // 替换数据提交表单内容
      this.userForm.nickname = nickName

      this.$toast.loading({ message: '更新中...', forbidClick: true, duration: 0 })
      const { data } = await changeUserInfo(this.$qs.stringify(this.userForm), this.userInfo.id)
      if (data.code !== 201) {
        this.$toast.clear()
        this.notifyShow('danger', data.msg)
        return
      }
      this.$toast.clear()
      this.notifyShow('success', data.msg)
      this.upPopupUserNickname = false
    },
    // 更改个性签名 当点击确定按钮的时候
    async upDataAutograph () {
      this.userForm.autograph = this.originalUserInfo.autograph

      this.$toast.loading({ message: '更新中...', forbidClick: true, duration: 0 })
      const { data } = await changeUserInfo(this.$qs.stringify(this.userForm), this.userInfo.id)
      if (data.code !== 201) {
        this.notifyShow('danger', data.msg)
        this.$toast.clear()
        return
      }
      this.$toast.clear()
      this.notifyShow('success', data.msg)
      this.upPopupUserAutograph = false
    },
    // 更改邮箱 当点击确定按钮的时候
    async upDataMail () {
      const mail = this.originalUserInfo.mail // 获取到输入的邮箱
      const mailPattern = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/ // 邮箱验证规则

      // 如果正则不通过则返回
      if (!mailPattern.test(mail)) {
        this.notifyShow('danger', '邮箱格式不正确')
        return
      }
      this.userForm.mail = mail
      this.$toast.loading({ message: '更新中...', forbidClick: true, duration: 0 })
      const { data } = await changeUserInfo(this.$qs.stringify(this.userForm), this.userInfo.id)
      if (data.code !== 201) {
        this.$toast.clear()
        this.notifyShow('danger', data.msg)
        return
      }
      this.$toast.clear()
      this.notifyShow('success', data.msg)
      this.upPopupUserMail = false
    },
    // 更改性别
    async onConfirmGender (value) {
      this.userForm.gender = value
      this.$toast.loading({ message: '更新中...', forbidClick: true, duration: 0 })
      const { data } = await changeUserInfo(this.$qs.stringify(this.userForm), this.userInfo.id)
      if (data.code !== 201) {
        this.$toast.clear()
        this.notifyShow('danger', data.msg)
        return
      }
      this.$toast.clear()
      this.notifyShow('success', data.msg)
      this.upPopupUserGender = false
    },
    // 更改感情状况
    async onConfirmFeeling (value) {
      this.userForm.feeling = value
      this.$toast.loading({ message: '更新中...', forbidClick: true, duration: 0 })
      const { data } = await changeUserInfo(this.$qs.stringify(this.userForm), this.userInfo.id)
      if (data.code !== 201) {
        this.$toast.clear()
        this.notifyShow('danger', data.msg)
        return
      }
      this.$toast.clear()
      this.notifyShow('success', data.msg)
      this.upPopupUserFeeling = false
    },
    // 更改工作
    async onConfirmWork (value) {
      this.userForm.work = value
      this.$toast.loading({ message: '更新中...', forbidClick: true, duration: 0 })
      const { data } = await changeUserInfo(this.$qs.stringify(this.userForm), this.userInfo.id)
      if (data.code !== 201) {
        this.$toast.clear()
        this.notifyShow('danger', data.msg)
        return
      }
      this.$toast.clear()
      this.notifyShow('success', data.msg)
      this.upPopupUserWork = false
    },
    // 选择生日
    async confirmBirthday (value) {
      this.userForm.birthday = this.getNowFormatDate(value)
      this.$toast.loading({ message: '更新中...', forbidClick: true, duration: 0 })
      const { data } = await changeUserInfo(this.$qs.stringify(this.userForm), this.userInfo.id)
      if (data.code !== 201) {
        this.$toast.clear()
        this.notifyShow('danger', data.msg)
        return
      }
      this.$toast.clear()
      this.notifyShow('success', data.msg)
      this.upPopupUserBirthday = false
    },
    // 计算时间
    getNowFormatDate (time) {
      const date = new Date(time)
      const seperator1 = '-'
      const year = date.getFullYear()
      let month = date.getMonth() + 1
      let strDate = date.getDate()
      if (month >= 1 && month <= 9) {
        month = '0' + month
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = '0' + strDate
      }
      var currentdate = year + seperator1 + month + seperator1 + strDate
      return currentdate
    },
    // 点击取消后的函数
    closePopup (element) {
      this[element] = false
      this.notifyShow('danger', '已取消')
    }
  }
}
</script>

<style lang='less' scoped>
#settingIndex {
  .van-cell-group {
    .van-image {
      width: 40px;
      height: 40px;
    }
  }
  .CropperImgPopupBox {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    width: 100%;
    background: #000;
    .cropper_box {
      .cropper_img {
        display: block;
        max-width: 90%;
      }
    }
    .ConfirmuploadBar {
      background: #000;
      position: absolute;
      bottom: 0;
      right: 0;
      left: 0;
      z-index: 200;
    }
  }
}
</style>
