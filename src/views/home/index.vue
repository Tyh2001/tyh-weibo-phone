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
            @loadBlogList="loadgetAllBlogList(), loadgetFollowAllBlogList()"
          />

          <NoMore />
        </van-tab>

        <!-- 关注 -->
        <van-tab title="关注">
          <BlogList
            v-for="(followblogItem, index) in followBlogList"
            :key="index"
            :blogItem="followblogItem"
            @loadBlogList="loadgetFollowAllBlogList"
          />

          <NoMore />
        </van-tab>
      </van-tabs>

      <!-- 添加按钮 -->
      <van-icon name="add-o" size="22" @click="addBlogList" />
    </div>

    <!-- 发布弹出层 -->
    <van-popup
      v-model="releaseBlogPopup"
      position="bottom"
      :style="{ height: '100%' }"
    >
      <ReleaseList @closePropop="releaseBlogPopup = false" />
    </van-popup>
  </div>
</template>

<script>
import { mapState } from 'vuex'
// 获取所有博客 - 获取我关注人的博客内容
import { getAllBlogList, getFollowAllBlogList } from '@/api/blog'
import BlogList from '@/components/BlogList'
import ReleaseList from '@/components/ReleaseList'
import NoMore from '@/components/NoMore'
export default {
  name: 'homeIndex',
  components: {
    BlogList,
    ReleaseList,
    NoMore
  },
  props: {},
  data () {
    return {
      releaseBlogPopup: false, // 发布弹出层
      active: 0, // 选项卡
      followBlogList: [], // 关注人的博客内容
      blogList: [] // 博客内容
    }
  },
  computed: {
    ...mapState(['userInfo'])
  },
  watch: {
    active () {
      if (!this.userInfo && this.active === 1) {
        this.$router.push('/user/login')
        this.$notify({ type: 'danger', message: '请登录后再查看关注', duration: 1300 })
      }
    }
  },
  created () {
    this.loadgetAllBlogList() // 获取所有博客内容
    this.loadgetFollowAllBlogList() // 获取我关注人的博客内容
  },
  mounted () { },
  methods: {
    // 获取所有博客的内容
    async loadgetAllBlogList () {
      const { data } = await getAllBlogList()
      this.blogList = data.data
    },
    // 首页导航栏添加按钮
    addBlogList () {
      // 当点击 + 号的时候 如果没有登录则跳到登录页面
      if (this.userInfo) {
        this.releaseBlogPopup = true
        return
      }
      this.$notify({ type: 'danger', message: '请登录后再试', duration: 1300 })
      this.$router.push('/user/login')
    },
    // 获取我关注人的博客内容
    async loadgetFollowAllBlogList () {
      if (this.userInfo) {
        const { data } = await getFollowAllBlogList(this.userInfo.id)
        this.followBlogList = data.data
      }
    }
  }
}
</script>

<style lang='less' scoped>
#honeIndex {
  #Navigation {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    user-select: none;
    overflow: hidden;
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
}
</style>
