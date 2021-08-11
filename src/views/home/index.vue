<template>
  <div id="honeIndex">
    <div id="Navigation">
      <van-icon name="chat-o" size="22" />
      <van-tabs v-model="active">
        <!-- 全部 -->
        <van-tab title="全部">
          <BlogList
            v-for="(blogItem, index) in blogList"
            :key="index"
            :blogItem="blogItem"
          />
        </van-tab>

        <!-- 关注 -->
        <van-tab title="关注">后续更新</van-tab>
      </van-tabs>
      <van-icon name="add-o" size="22" @click="releaseBlogPopup = true" />
    </div>

    <!-- 发布弹出层 -->
    <van-popup
      v-model="releaseBlogPopup"
      position="bottom"
      :style="{ height: '100%' }"
    >
      <!-- 导航栏 -->
      <van-nav-bar
        title="发布"
        left-arrow
        @click-left="releaseBlogPopup = false"
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
    </van-popup>
  </div>
</template>

<script>
import { mapState } from 'vuex'
// 获取所有博客
import { getAllBlogList, onReleaseBlog } from '@/api/blog'
import BlogList from '@/components/BlogList'
export default {
  name: 'homeIndex',
  components: {
    BlogList
  },
  props: {},
  data () {
    return {
      publishDisabledBtn: false, // 发布按钮禁用状态
      imagesList: [], // 需要展示的的图片
      upLoadImagesFileArray: [], // 需要上传文件的数组
      blogText: '', // 发布的文字内容
      releaseBlogPopup: false, // 发布弹出层
      active: 2, // 选项卡
      blogList: [] // 博客内容
    }
  },
  computed: {
    ...mapState(['userInfo'])
  },
  watch: {},
  created () {
    this.loadgetAllBlogList() // 获取所有博客内容
  },
  mounted () { },
  methods: {
    // 获取所有博客的内容
    async loadgetAllBlogList () {
      const { data } = await getAllBlogList()
      console.log(data)
      this.blogList = data.data
    },
    // 当上传文件被改变时
    upImageFileInputChange (e) {
      const filesArr = Array.from(e.target.files) // 将获取到的 files 对象转换为数组形式

      // 将每一项添加到全局数组中
      for (let i = 0; i < filesArr.length; i++) {
        this.upLoadImagesFileArray.push(filesArr[i])
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
        this.releaseBlogPopup = false

        this.loadgetAllBlogList()
      }
      this.publishDisabledBtn = false
    }
  }
}
</script>

<style lang='less' scoped>
#honeIndex {
  #Navigation {
    display: flex;
    justify-content: space-around;
    align-items: center;
    .van-tabs {
      width: 200px;
      /deep/ .van-tabs__nav {
        width: 200px;
      }
      .van-tab__pane {
        position: fixed;
        right: 0;
        left: 0;
        bottom: 50px;
        top: 43px;
        background: #eee;
        overflow: auto;
      }
    }
  }
  // 发布弹出层
  .van-popup {
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
}
</style>
