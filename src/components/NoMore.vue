<template>
  <!-- 没有更多了组件 -->
  <div id="noMore">
    <p class="noMore_text">没有更多了哦~~</p>
  </div>
</template>

<script>
export default {
  name: 'noMore',
  components: {},
  props: {},
  data () {
    return {}
  },
  computed: {},
  watch: {},
  created () { },
  mounted () { },
  methods: {}
}
</script>

<style lang='less' scoped>
#noMore {
  width: 100%;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgb(243, 243, 243);
  .noMore_text {
    color: #333;
    font-size: 15px;
  }
}
</style>
