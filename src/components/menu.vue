<template>
  <div class="nav_wrap" v-if="isShowMenu()">
    <div class="nav_main">
      <div
        :class="'nav_item ' + checkIsActive(m.path)"
        v-for="(m, index) in mlist"
        :key="index"
        @click="goPath(m.path)"
      >
        <div :class="'nav_icon ' + m.ico"></div>
        <div class="nav_text">{{ m.mname }}</div>
      </div>
    </div>
  </div>
</template>
<script>
export default ({
  name: 'MyMenu',
  props: {
  },
  mounted() {

  },
  data() {
    return {
      mlist: [
        {
          ico: 'home',
          path: '/',
          mname: '首页'
        },
        {
          ico: 'store',
          path: '/store',
          mname: '购买算力'
        },
        {
          ico: 'fund',
          path: '/fund',
          mname: '我的资产'
        }
      ]
    }
  },
  methods: {
    checkIsActive(path) {
      if (this.$route.path.toLowerCase() == path.toLowerCase()) {
        return "active"
      } else {
        return ""
      }
    },
    goPath(path) {
      if (path != '/') {
        this.$router.push(path)
      } else {
        window.location.href = "https://www.minefi.io/"
      }

    },
    isShowMenu() {
      return this.$route.path.indexOf("/store/") == -1
      // && this.$route.path.indexOf("/user/") == -1
    }
  }
})
</script>
<style src="@/assets/css/store.css" scoped></style>
<style src="@/assets/css/extend.css" scoped></style>