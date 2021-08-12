<template>
  <div id="myIndex">
    <div class="banner">
      <van-icon name="wap-nav" @click="popupShow = true" />
    </div>

    <!-- 用户资料 -->
    <div id="userInfo">
      <div class="Info_list">
        <img
          class="user_photo"
          :src="userForm.avatar"
          @click="$router.push('/setting')"
        />

        <!-- 获赞粉丝框 -->
        <van-grid>
          <van-grid-item>
            <template #default>
              <p class="title">获赞</p>
              <p class="num">0</p>
            </template>
          </van-grid-item>

          <van-grid-item>
            <template #default>
              <p class="title">粉丝</p>
              <p class="num">0</p>
            </template>
          </van-grid-item>

          <van-grid-item>
            <template #default>
              <p class="title">关注</p>
              <p class="num">0</p>
            </template>
          </van-grid-item>
        </van-grid>
      </div>

      <div class="Info_nickname">
        <h5 class="nickname">{{ userForm.nickname }}</h5>
        <p class="autograph">{{ userForm.autograph }}</p>
      </div>
    </div>

    <!-- 用户发布的内容 -->
    <div v-if="userBlogList.length">
      <BlogList
        v-for="(blogItem, index) in userBlogList"
        :key="index"
        :blogItem="blogItem"
      />
    </div>

    <div class="userBlogListNoLength" v-else @click="$router.push('/release')">
      <p>你还没有发布过内容哦</p>
      <p>点击发布动态</p>
    </div>

    <!-- 点击侧边弹出层 -->
    <van-popup v-model="popupShow" position="right">
      <van-cell-group :border="false">
        <van-cell to="/setting" title="设置" is-link />
        <van-cell to="/pass" title="修改密码" is-link />
      </van-cell-group>
      <van-button type="default" size="normal" @click="outLogin"
        >退出登录</van-button
      >
    </van-popup>
  </div>
</template>

<script>
import { getUserInfo } from '@/api/user'
import { getUserBlogList } from '@/api/blog'
import { mapState } from 'vuex'
import BlogList from '@/components/BlogList'
export default {
  name: 'myIndex',
  components: {
    BlogList
  },
  props: {},
  data () {
    return {
      userBlogList: [], // 用户发布的内容
      popupShow: false, // 侧边弹出层
      userForm: {} // 个人信息
    }
  },
  computed: {
    ...mapState(['userInfo'])
  },
  watch: {},
  created () {
    this.loadgetUserInfo() // 获取用户资料
    this.loadgetUserBlogList() // 获取指定用户的博客内容
  },
  mounted () { },
  methods: {
    // 获取用户信息
    async loadgetUserInfo () {
      const { data } = await getUserInfo(this.userInfo.id)
      this.userForm = data.data
    },
    // 退出登录
    outLogin () {
      this.$dialog.confirm({
        title: '确定退出当前账号吗？',
        message: '退出账号'
      })
        .then(() => {
          this.$store.commit('outLogin')
          this.$notify({ type: 'success', message: '已成功退出账号', duration: 1300 })
          this.$router.push('/')
        })
        .catch(() => { })
    },
    // 获取指定用户的博客内容
    async loadgetUserBlogList () {
      const { data } = await getUserBlogList(this.userInfo.id)
      console.log(data)
      this.userBlogList = data.data
    }
  }
}
</script>

<style lang='less' scoped>
#myIndex {
  .banner {
    width: 100%;
    height: 120px;
    background: url("./images/img.png") no-repeat center;
    background-size: cover;
    position: relative;
    .van-icon {
      position: absolute;
      top: 20px;
      right: 20px;
      font-size: 18px;
    }
  }
  #userInfo {
    width: 100%;
    padding: 0 10px 10px 10px;
    box-sizing: border-box;
    .Info_list {
      width: 100%;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .user_photo {
        width: 76px;
        height: 76px;
        border: 4px solid rgba(255, 255, 255, 0.4);
        border-radius: 50%;
        margin-top: -20px;
        position: relative;
      }
      .van-grid {
        border: none;
        /deep/ .van-grid-item__content {
          width: 70px;
          border: none;
          .title {
            font-size: 13px;
            color: #333;
          }
          .num {
            font-size: 14px;
            color: #333;
          }
        }
      }
    }
    .Info_nickname {
      .nickname {
        color: #333;
        margin-top: 8px;
      }
      .autograph {
        font-size: 12px;
        color: #333;
        margin-top: 4px;
      }
    }
  }
  .van-popup {
    padding: 30px 10px;
    box-sizing: border-box;
    width: 60%;
    height: 100%;
    .van-cell:active {
      background: none;
    }
    .van-button {
      width: 90%;
      position: absolute;
      bottom: 30px;
    }
  }
  // 没有发布动态
  .userBlogListNoLength {
    margin-top: 170px;
    p {
      font-size: 16px;
      color: #333;
      text-align: center;
      line-height: 30px;
    }
  }
}
</style>
