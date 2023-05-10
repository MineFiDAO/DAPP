<script>
import("@/assets/css/reset.css")
</script>
<template>
  <div id="app">
    <div class="app">
      <router-view />
      <MyMenu></MyMenu>
    </div>
  </div>
</template>
<style lang="less">
@primary-color: black;
div::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}
div::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  opacity: 0.2;
  background: fade(@primary-color, 60%);
}
div::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 0;
  background: fade(@primary-color, 30%);
}
</style> 
<style>
.van-nav-bar__arrow {
  font-size: 24px;
}

.van-nav-bar .van-icon {
  color: #323233;
}
.van-dropdown-item {
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}
</style>
