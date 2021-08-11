<template>
  <div id="BlogList">
    <!-- 用户头像 -->
    <div class="userInfo">
      <img class="photo" :src="blogItem.avatar" />
      <div class="info">
        <h4 class="nickname">{{ blogItem.nickname }}</h4>
        <p class="time">{{ blogItem.release_time }}</p>
      </div>
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
        <div class="say">
          <van-icon name="chat-o" />
          评论
        </div>
        <div class="good">
          <van-icon name="good-job-o" />
          点赞
        </div>
      </div>
    </div>
  </div>
</template>

<script>
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
    return {}
  },
  computed: {},
  watch: {},
  created () { },
  mounted () { },
  methods: {
    blogItemImgURL (url) {
      return `http://localhost/Virgo_Tyh_PHP/public/blogImg/${url}`
    }
  }
}
</script>

<style lang='less' scoped>
#BlogList {
  background: #fff;
  margin-top: 10px;
  width: 100%;
  padding: 10px 10px 10px 10px;
  box-sizing: border-box;
  border-radius: 5px;
  .userInfo {
    width: 73px;
    display: flex;
    width: 100%;
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
</style>
