<template>
  <!-- 发布组件 -->
  <div id="ReleaseList">
    <!-- 导航栏 -->
    <van-nav-bar
      title="发布"
      :left-arrow="lefArrowtShow"
      @click-left="closePropop"
    >
      <template #right>
        <van-button
          type="primary"
          :disabled="publishDisabledBtn"
          @click="publishContent"
          >发布</van-button
        >
      </template>
    </van-nav-bar>

    <van-field
      v-model="blogText"
      rows="5"
      autosize
      type="textarea"
      placeholder="今天有什么想说的？"
    />
    <van-icon name="photo-o" @click="$refs.imgfile.click()" />
    <input
      ref="imgfile"
      style="display: none"
      type="file"
      accept="image/*"
      multiple="multiple"
      name="image"
      @change="upImageFileInputChange($event)"
    />

    <!-- 需要上传的图片展示框 -->
    <div class="upImageBox" v-if="imagesList.length">
      <!-- 展示图片的盒子 -->
      <div
        class="item_img_change_box"
        v-for="(url, index) in imagesList"
        :key="index"
      >
        <!-- 移除上传图片的按钮 -->
        <van-icon name="close" @click="removeImage(index)" />
        <van-image fit="cover" :src="url" />
      </div>
      <!-- 上传文件的方框 -->
      <div
        v-if="imagesList.length < 9"
        class="item_img_add"
        @click="clickFileAddImg"
      >
        <van-icon name="plus" />
      </div>
    </div>
  </div>
</template>

<script>
import { onReleaseBlog } from '@/api/blog'
import { mapState } from 'vuex'
export default {
  name: 'ReleaseList',
  components: {},
  props: {
    // 左侧返回按钮是否显示
    lefArrowtShow: {
      type: Boolean,
      default: true
    },
    // 发布成功后跳转首页
    SuccessGOhome: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      publishDisabledBtn: false, // 发布按钮禁用状态
      imagesList: [], // 需要展示的的图片
      upLoadImagesFileArray: [], // 需要上传文件的数组
      blogText: '' // 发布的文字内容
    }
  },
  computed: {
    ...mapState(['userInfo'])
  },
  watch: {},
  created () { },
  mounted () { },
  methods: {
    // 当上传文件被改变时
    upImageFileInputChange (e) {
      const filesArr = Array.from(e.target.files) // 将获取到的 files 对象转换为数组形式

      // 将每一项添加到全局数组中
      for (let i = 0; i < filesArr.length; i++) {
        if (this.upLoadImagesFileArray.length < 9) {
          this.upLoadImagesFileArray.push(filesArr[i])
        } else {
          break
        }
      }

      // 获取到选择文件的长度（数量）
      const fileLength = this.$refs.imgfile.files.length

      // 如果需要上传的文件数量小于9才执行循环
      if (this.imagesList.length < 9) {
        for (let i = 0; i < fileLength; i++) {
          // 进入循环之后还需要判定如果数组长度不小于9则继续添加 否则跳出循环体
          if (this.imagesList.length < 9) {
            this.imagesList.push(URL.createObjectURL(this.$refs.imgfile.files[i]))
          } else {
            break
          }
        }
        // 清空文本框 防止上传相同内容不触发
        this.$refs.imgfile.value = ''
        return
      }
      // 长度到达上限之后提示框展示
      this.$notify({ type: 'danger', message: '最多只能上传9张图片', duration: 1300 })
    },
    // 点击上传文件的方形框位置
    clickFileAddImg () {
      // 跟随在后面的添加按钮
      // 如果选择图片的场地小于9，则点击可以继续上传
      // 否则点击没有效果
      return this.imagesList.length < 9
        ? this.$refs.imgfile.click()
        : this.$notify({ type: 'danger', message: '最多只能上传9张图片', duration: 1300 })
    },
    // 点击移除照片
    removeImage (index) {
      this.imagesList.splice(index, 1) // 移除需要展示的数组中的图片
      this.upLoadImagesFileArray.splice(index, 1) // 移除需要上传数组中的图片
    },
    // 点击发布的按钮
    async publishContent () {
      if (this.blogText === '') {
        this.$notify({ type: 'danger', message: '内容为空不能发布', duration: 1300 })
        return
      }
      this.publishDisabledBtn = true
      // 新建一个 FormData
      const formData = new FormData()

      // 循环每一个选择的文件 将其添加 append
      this.upLoadImagesFileArray.forEach(item => {
        // 给每一项命名为 blogImages 后面的 [] 必须加
        formData.append('blogImages[]', item, '.jpg')
      })

      const { data } = await onReleaseBlog(formData, {
        userId: this.userInfo.id,
        blogText: this.blogText
      })

      if (data.code === 201) {
        this.$notify({ type: 'success', message: data.msg, duration: 1300 })

        // 清空显示的图片和需要上传的数组
        this.imagesList = []
        this.upLoadImagesFileArray = []
        this.blogText = ''
        this.$emit('closePropop') // 关闭弹出层

        // 发布成功后跳转首页
        if (this.SuccessGOhome) {
          this.$router.push('/')
        }
      }
      this.publishDisabledBtn = false
    },
    // 传值 关闭发布弹出层
    closePropop () {
      this.$emit('closePropop')
    }
  }
}
</script>

<style lang='less' scoped>
// 发布弹出层
#ReleaseList {
  .van-field {
    max-height: 400px;
    overflow: auto;
  }
  .van-icon-photo-o {
    color: #333;
    margin-left: 12px;
    margin-top: 10px;
  }
  // 预览上传图片
  .upImageBox {
    margin-left: 12px;
    margin-top: 5px;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    // 展示长传的每个图片的盒子
    .item_img_change_box {
      width: 110px;
      height: 110px;
      display: inline-block;
      margin-right: 3px;
      margin-top: 3px;
      position: relative;
      z-index: 20;
      .van-image {
        width: 100%;
        height: 100%;
        border-radius: 3px;
      }
      // 选中上传图片上的移除按钮
      .van-icon-close {
        position: absolute;
        right: 7px;
        top: 5px;
        z-index: 30;
        font-size: 15px;
      }
    }
    // 跟随在后面的添加图标内容
    .item_img_add {
      width: 106px;
      height: 106px;
      border: 1px solid #333;
      border-radius: 3px;
      display: inline-block;
      user-select: none;
      cursor: pointer;
      font-size: 30px;
      margin-top: 3px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .van-button {
    height: 26px;
  }
}
</style>
