<template>
  <div id="App">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
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

<style lang='less'>
* {
  margin: 0;
  padding: 0;
}
html,
body,
#App {
  width: 100%;
  height: 100%;
}
</style>
