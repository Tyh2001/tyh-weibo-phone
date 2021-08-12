<template>
  <div id="releaseIndex">
    <ReleaseList :lefArrowtShow="false" :SuccessGOhome="true" />
  </div>
</template>

<script>
import ReleaseList from '@/components/ReleaseList'
export default {
  name: 'releaseIndex',
  components: {
    ReleaseList
  },
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
</style>
