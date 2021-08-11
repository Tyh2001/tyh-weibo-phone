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
            :src="userForm.avatar"
            @click="$refs.file_input.click()"
          />
        </div>
      </van-cell>
      <van-cell center title="昵称" is-link :value="userForm.nickname" />
      <van-cell center title="个性签名" is-link :value="userForm.autograph" />
      <van-cell center title="性别" is-link :value="userForm.gender" />
      <van-cell center title="感情状况" is-link :value="userForm.feeling" />
      <van-cell center title="职业" is-link :value="userForm.work" />
      <van-cell center title="生日" is-link :value="userForm.birthday" />
      <van-cell center title="邮箱" is-link :value="userForm.mail" />
    </van-cell-group>

    <!-- 上传头像的弹窗 -->
    <van-popup
      class="CropperImgPopupBox"
      v-model="upUserPhotOverlay"
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
  </div>
</template>

<script>
import { getUserInfo, uploadUserPhoto } from '@/api/user'
import { mapState } from 'vuex'
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'
export default {
  name: 'settingIndex',
  components: {},
  props: {},
  data () {
    return {
      upUserPhotOverlay: false, // 上传头像的弹框
      UploadfileImgUrl: '', // 上传文件的图片路径
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
    },
    // 当上传文件被改变时候 获取图片路径 展示裁切器对话框
    onChangeFileInp () {
      // 获取到上传图片的路径
      this.UploadfileImgUrl = URL.createObjectURL(this.$refs.file_input.files[0])
      this.upUserPhotOverlay = true // 展示对话框
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
      this.$toast('取消上传')
      this.upUserPhotOverlay = false
    },
    // 确认上传头像
    ToUploadPhoto () {
      // blob 为裁切的结果图片
      this.cropper.getCroppedCanvas().toBlob((blob) => {
        const formData = new FormData()

        // 这里第三个参数为图片后缀名
        formData.append('photo', blob, '.jpg')

        uploadUserPhoto(formData, this.userInfo.id).then(res => {
          this.userForm.avatar = res.data.data.url // 更新头像
          this.upUserPhotOverlay = false // 关于对话框
          this.$toast('上传头像成功')
        })
      })
    },
    // 当对话框完全关闭的时候
    dialogClosed () {
      // 销毁裁切器
      this.cropper.destroy()
      this.$refs.file_input.value = ''
    }
  }
}
</script>

<style lang='less' scoped>
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
</style>
