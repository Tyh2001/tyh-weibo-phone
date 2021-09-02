<template>
  <div id="myIndex">
    <div class="banner">
      <p
        class="return"
        v-if="userInfo.id.toString() !== $route.params.id.toString()"
        @click="$router.push('/')"
      >
        返回
      </p>
      <van-icon
        v-show="$route.params.id.toString() === userInfo.id.toString()"
        name="wap-nav"
        @click="popupShow = true"
      />
    </div>

    <!-- 用户资料 -->
    <div id="userInfo">
      <div class="Info_list">
        <img
          class="user_photo"
          :src="userPhotoAvatar"
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

          <van-grid-item @click="fansPopupShowList">
            <template #default>
              <p class="title">粉丝</p>
              <p class="num">{{ userForm.fans_list }}</p>
            </template>
          </van-grid-item>

          <van-grid-item @click="followPopupShowList">
            <template #default>
              <p class="title">关注</p>
              <p class="num">{{ userForm.follow_list }}</p>
            </template>
          </van-grid-item>
        </van-grid>
      </div>

      <div class="Info_nickname">
        <h5 class="nickname">{{ userForm.nickname }}</h5>
        <p class="autograph">{{ userForm.autograph }}</p>

        <hr />

        <p class="info" v-if="userForm.birthday">
          生日：
          <van-tag type="primary">{{ userForm.birthday }}</van-tag>
        </p>
        <p class="info" v-if="userForm.feeling">
          感情状况：
          <van-tag type="success">{{ userForm.feeling }}</van-tag>
        </p>
        <p class="info" v-if="userForm.work">
          工作：
          <van-tag type="danger">{{ userForm.work }}</van-tag>
        </p>
        <p class="info" v-if="userForm.mail">
          邮箱：
          <van-tag type="warning">{{ userForm.mail }}</van-tag>
        </p>
        <p class="info">
          注册时间：
          <van-tag type="primary">{{ registerTime() }}</van-tag>
        </p>

        <hr />

        <!-- 关注按钮 -->
        <van-button
          v-if="followBtnShow"
          id="followBtn"
          icon="plus"
          :type="onFollowChange ? 'danger' : 'default'"
          size="small"
          :disabled="followBtnDisabled"
          @click="onFollowChange ? deleteFollowTa() : changeFollowTa()"
        >
          {{ onFollowChange ? "取消关注 TA" : "关注 TA" }}
        </van-button>
      </div>
    </div>

    <!-- 用户发布的内容 -->
    <div v-if="userBlogList.length">
      <BlogList
        v-for="(blogItem, index) in userBlogList"
        :key="index"
        :blogItem="blogItem"
        @loadBlogList="loadgetUserBlogList"
      />

      <NoMore />
    </div>

    <div class="userBlogListNoLength" v-else @click="$router.push('/release')">
      <p>你还没有发布过内容哦</p>
      <p>点击发布动态</p>
    </div>

    <!-- 点击侧边弹出层 -->
    <van-popup id="leftPopup" v-model="popupShow" position="right">
      <van-cell-group :border="false">
        <van-cell to="/setting" title="设置" is-link />
        <van-cell to="/pass" title="修改密码" is-link />
      </van-cell-group>
      <van-button type="default" size="normal" @click="outLogin">
        退出登录
      </van-button>
    </van-popup>

    <!-- 关注列表弹出层 -->
    <van-popup
      v-model="followPopupShow"
      position="bottom"
      :style="{ height: '100%' }"
    >
      <van-nav-bar
        title="我的关注"
        left-arrow
        @click-left="followPopupShow = false"
      />

      <UserList
        v-for="(myFollowUserItem, index) in myFollowUser"
        :key="index"
        :item="myFollowUserItem"
        @closePopup="followPopupShow = false"
      />
    </van-popup>

    <!-- 粉丝列表弹出层 -->
    <van-popup
      v-model="fansPopupShow"
      position="bottom"
      :style="{ height: '100%' }"
    >
      <van-nav-bar
        title="我的粉丝"
        left-arrow
        @click-left="fansPopupShow = false"
      />

      <UserList
        v-for="(myFansListItem, index) in myFansList"
        :key="index"
        :isFans="true"
        :item="myFansListItem"
        @closePopup="fansPopupShow = false"
      />
    </van-popup>
  </div>
</template>

<script>
// 获取我的博客列表 - 获取关注列表
import { getUserBlogList } from '@/api/blog'
import BlogList from '@/components/BlogList'
import NoMore from '@/components/NoMore'
import { getUserInfo } from '@/api/user'
import { mapState } from 'vuex'
import url from '@/utils/url'
import UserList from '@/components/UserList'
import { toDates } from '@/utils/changeTime'
// 关注用户 - 获取我的关注列表 - 获取我的粉丝列表 - 取消关注用户
import { onFollowUser, getFollowUserList, getFansUserList, deleteFollowUser } from '@/api/follow'
export default {
  name: 'myIndex',
  components: {
    BlogList,
    NoMore,
    UserList
  },
  props: {},
  data () {
    return {
      followBtnDisabled: false, // 关注取关按钮禁用状态
      onFollowChange: false, // 是否关注
      myFansList: [], // 我的粉丝列表
      myFollowUser: [], // 我的关注列表
      followPopupShow: false, // 关注展示的弹出层
      fansPopupShow: false, // 粉丝展示的弹出层
      userBlogList: [], // 用户发布的内容
      popupShow: false, // 侧边弹出层
      userForm: {} // 个人信息
    }
  },
  computed: {
    ...mapState(['userInfo']),
    // 头像地址
    userPhotoAvatar () {
      if (this.userForm.avatar) {
        return `${url}/userPhoto/${this.userForm.avatar}`
      }
      return ''
    },
    // 关注按钮的展示状态
    followBtnShow () {
      return this.userInfo.id.toString() !== this.$route.params.id.toString()
    }
  },
  watch: {
    // 监视路由的变化，如果发生变化就重新加载内容
    // 因为这里防止进入其他人的主页时候 再点击自己的博客不发生变化的问题
    '$route' (to, from) {
      if (this.$route.params.id) {
        this.loadgetUserInfo()
        this.loadgetUserBlogList()
      }
    }
  },
  created () {
    this.loadgetUserInfo() // 获取用户资料
    this.loadgetUserBlogList() // 获取指定用户的博客内容
    this.loadgetFollowUserList() // 获取我的关注列表
    this.loadgetFansUserList() // 获取我的粉丝列表
  },
  mounted () { },
  methods: {
    // 获取用户信息
    async loadgetUserInfo () {
      const { data } = await getUserInfo(this.$route.params.id)
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
      const { data } = await getUserBlogList(this.$route.params.id)
      this.userBlogList = data.data
    },
    // 获取我的关注列表
    async loadgetFollowUserList () {
      const { data } = await getFollowUserList(this.$qs.stringify({ user_id: this.userInfo.id }))
      this.myFollowUser = data.data

      // 判断如果关注列表中的已关注的用户 id === 路由参数中的 id 那么就是已经关注的用户
      data.data.forEach(item => {
        if (item.follower_id.toString() === this.$route.params.id.toString()) {
          this.onFollowChange = true
        }
      })
    },
    // 获取我的粉丝列表
    async loadgetFansUserList () {
      const { data } = await getFansUserList(this.$qs.stringify({ user_id: this.userInfo.id }))
      this.myFansList = data.data
    },
    // 打开粉丝列表
    fansPopupShowList () {
      if (this.userInfo.id.toString() === this.$route.params.id.toString()) {
        this.fansPopupShow = true
        return
      }
      this.$notify({ type: 'danger', message: '不能查看他人粉丝列表', duration: 1300 })
    },
    // 打开关注列表
    followPopupShowList () {
      if (this.userInfo.id.toString() === this.$route.params.id.toString()) {
        this.followPopupShow = true
        return
      }
      this.$notify({ type: 'danger', message: '不能查看他人关注列表', duration: 1300 })
    },
    // 将时间戳转换为正常的时间对象格式
    registerTime () {
      return toDates(this.userForm.regis_time)
    },
    // 关注
    async changeFollowTa () {
      this.followBtnDisabled = true
      const { data } = await onFollowUser(this.$qs.stringify(
        {
          user_id: this.userInfo.id,
          follower_id: this.$route.params.id
        }
      ))
      // 操作不成功时
      if (data.code !== 201) {
        this.$notify({ type: 'danger', message: data.msg, duration: 1300 })
        this.followBtnDisabled = false
        return
      }
      // 操作成功
      this.$notify({ type: 'success', message: data.msg, duration: 1300 })
      this.loadgetUserInfo()
      this.onFollowChange = true
      this.followBtnDisabled = false
    },
    // 取消关注
    async deleteFollowTa () {
      this.followBtnDisabled = true
      const { data } = await deleteFollowUser(this.$qs.stringify(
        {
          user_id: this.userInfo.id,
          follower_id: this.$route.params.id
        }
      ))
      // 操作不成功时
      if (data.code !== 201) {
        this.$notify({ type: 'danger', message: data.msg, duration: 1300 })
        this.followBtnDisabled = false
        return
      }
      // 操作成功
      this.$notify({ type: 'success', message: data.msg, duration: 1300 })
      this.loadgetUserInfo()
      this.loadgetFollowUserList() // 获取我的关注列表
      this.onFollowChange = false
      this.followBtnDisabled = false
    }
  }
}
</script>

<style lang='less' scoped>
#myIndex {
  padding-bottom: 49px;
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
    .return {
      position: absolute;
      top: 20px;
      left: 20px;
      font-size: 15px;
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
      #followBtn {
        width: 220px;
      }
      hr {
        margin: 5px 0 5px 0;
        height: 1px;
        background: #eee;
        border: none;
      }
      .info {
        font-size: 13px;
        color: #333;
        display: flex;
        align-items: center;
        line-height: 22px;
      }
    }
  }
  #leftPopup {
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
