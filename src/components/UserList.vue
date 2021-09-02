<template>
  <div id="UserList" @click="toUserBlog">
    <img
      class="userPhoto"
      :src="userPhotoAvatar(isFans ? item.user_avatar : item.follower_avatar)"
    />
    <p class="nickName">
      {{ isFans ? item.user_nickname : item.follower_nickname }}
    </p>
  </div>
</template>

<script>
import url from '@/utils/url'
export default {
  name: 'UserList',
  components: {},
  props: {
    // 每一项用户信息
    item: {
      required: true,
      type: Object
    },
    // 是否为粉丝列表
    isFans: {
      type: Boolean,
      required: false,
      default: false
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
    // 头像地址
    userPhotoAvatar (userPhotoSrc) {
      return `${url}/userPhoto/${userPhotoSrc}`
    },
    // 点击去到关注用户人的主页
    toUserBlog () {
      this.$router.push(`/my/${this.isFans ? this.item.user_id : this.item.follower_id}`)
      this.$emit('closePopup')
    }
  }
}
</script>

<style lang='less' scoped>
#UserList {
  height: 50px;
  padding: 15px;
  display: flex;
  cursor: pointer;
  align-items: center;
  box-sizing: border-box;
  border-bottom: 1px solid #dcdfe6;
  .userPhoto {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
  .nickName {
    color: #333;
    margin-left: 10px;
    font-size: 15px;
  }
}
</style>
