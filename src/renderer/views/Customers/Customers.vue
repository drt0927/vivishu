<template>
  <router-view></router-view>
</template>

<script>
export default {

}
</script>

<style>
.daum-layer-background {
  display: none;
  position: fixed;
  z-index: 9999;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  top: 0;
  left: 0;
}

.daum-wrapper {
  z-index: 9999;
  width: 470px;
  height: 500px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  overflow-y: auto;
}

.daum-layer-close {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 10000;
  color: white;
  font-size: x-large;
  cursor: pointer;
}
</style>