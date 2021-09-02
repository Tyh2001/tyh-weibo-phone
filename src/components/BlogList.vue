<template>
  <div id="BlogList">
    <!-- 用户头像 -->
    <div class="userInfo">
      <div class="userInfo_name">
        <img class="photo" :src="blogPhotoImg(blogItem.avatar)" />
        <div class="info">
          <h4 class="nickname">{{ blogItem.nickname }}</h4>
          <p class="time">{{ blogItem.release_time }}</p>
        </div>
      </div>

      <van-icon
        v-if="userInfo"
        name="arrow-down"
        size="18px"
        @click="changePopup = true"
      />
    </div>
    <div class="blog">
      <p class="blogText">{{ blogItem.text }}</p>

      <div class="blogImg">
        <van-image
          class="blogImg-item"
          v-for="(blogItemImg, index) in blogItem.image"
          :key="index"
          fit="cover"
          :src="blogItemImgURL(blogItemImg)"
        />
      </div>

      <!-- 点赞框 -->
      <div class="fabulous">
        <div class="say" @click="changeSay">
          <van-icon name="chat-o" />
          评论
        </div>
        <div class="good" @click="changeGood">
          <van-icon name="good-job-o" />
          点赞
        </div>
      </div>
    </div>

    <!-- 点击编辑的弹出层 -->
    <van-popup
      v-if="userInfo"
      v-model="changePopup"
      position="bottom"
      get-container="body"
    >
      <p>
        <van-icon name="minus" />
      </p>
      <van-cell-group>
        <van-cell
          v-if="changeDelete"
          title="删除"
          icon="delete-o"
          @click="deleteBlog"
        />
        <van-cell
          v-if="followShow"
          title="关注Ta"
          icon="friends-o"
          @click="changeFollowTa"
        />
        <van-cell
          v-if="followShow"
          title="取消关注Ta"
          icon="manager-o"
          @click="changeNotFollowTa"
        />

        <van-button
          type="default"
          round
          size="small"
          @click="changePopup = false"
        >
          取消
        </van-button>
      </van-cell-group>
    </van-popup>
  </div>
</template>

<script>
import { deleteMyBlogList } from '@/api/blog'
import { mapState } from 'vuex'
import url from '@/utils/url'
export default {
  name: 'BlogList',
  components: {},
  props: {
    // 博客内容
    blogItem: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      changePopup: false // 点击编辑展示的弹出层
    }
  },
  computed: {
    ...mapState(['userInfo']),
    // 是否显示关注和取消关注的按钮展示
    followShow () {
      return this.blogItem.user_id !== this.userInfo.id
    },
    // 是否显示删除按钮
    changeDelete () {
      return this.blogItem.user_id === this.userInfo.id
    }
  },
  watch: {},
  created () { },
  mounted () { },
  methods: {
    // 图片路径参数
    blogItemImgURL (imgUrl) {
      return `${url}/blogImg/${imgUrl}`
    },
    // 头像地址
    blogPhotoImg (photoUrl) {
      return `${url}/userPhoto/${photoUrl}`
    },
    // 删除指定博客内容
    deleteBlog () {
      this.$dialog.confirm({
        title: '确定删除？',
        message: '该操作将会永久删除内容！'
      })
        .then(async () => {
          const { data } = await deleteMyBlogList(this.blogItem.blogId)
          this.changePopup = false
          this.$notify({ type: 'success', message: data.msg, duration: 1300 })

          // 给父组件发送自定义事件
          this.$emit('loadBlogList')
        })
        .catch(() => { })
    },
    // 关注
    changeFollowTa () {
      this.$notify({ type: 'danger', message: '开发中...稍后再试', duration: 1300 })
    },
    // 取消关注
    changeNotFollowTa () {
      this.$notify({ type: 'danger', message: '开发中...稍后再试', duration: 1300 })
    },
    // 点击评论
    changeSay () {
      this.$notify({ type: 'danger', message: '评论功能正在开发中...', duration: 1300 })
    },
    // 点击点赞
    changeGood () {
      this.$notify({ type: 'danger', message: '点赞功能正在开发中...', duration: 1300 })
    }
  }
}
</script>

<style lang='less' scoped>
#BlogList {
  background: #fff;
  margin-top: 10px;
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
  border-radius: 5px;
  .userInfo {
    width: 73px;
    display: flex;
    justify-content: space-between;
    width: 100%;
    .userInfo_name {
      display: flex;
      .photo {
        width: 45px;
        height: 45px;
        border-radius: 50%;
      }
      .info {
        .nickname {
          line-height: 30px;
          color: #333;
          font-size: 15px;
          margin-left: 5px;
        }
        .time {
          font-size: 12px;
          color: #5e5e5e;
          margin-left: 5px;
        }
      }
    }
  }
  .blog {
    width: 100%;
    margin-top: 10px;

    .blogText {
      color: #252525;
      font-size: 14px;
      line-height: 24px;
    }
    .blogImg {
      display: flex;
      flex-wrap: wrap;
      .blogImg-item {
        width: 110px;
        height: 110px;
        margin-top: 10px;
        margin-right: 5px;
      }
    }
    .fabulous {
      margin-top: 20px;
      display: flex;
      height: 35px;
      .good,
      .say {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        font-size: 14px;
        user-select: none;
        .tyh-icon {
          margin-right: 5px;
        }
      }
    }
  }
}
// 编辑的弹出层
.van-popup {
  padding-bottom: 20px;
  p {
    text-align: center;
    line-height: 10px;
  }
  .van-button {
    width: 100%;
  }
  .van-cell:active {
    background-color: #f2f3f5;
  }
}
</style>
