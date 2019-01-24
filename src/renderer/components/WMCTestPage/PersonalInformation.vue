<template>
  <div>
    <div class="items">
      <div class="title">학교</div>
      <div class="item">
        <sui-input placeholder="예) 한국초등학교" />
      </div>
      <div class="title">학년</div>
      <div class="item">
        <sui-input placeholder="예) 한국초등학교" />
      </div>
      <div class="title">반</div>
      <div class="item">
        <sui-input placeholder="예) 한국초등학교" />
      </div>
      <div class="title">번호</div>
      <div class="item">
        <sui-input placeholder="예) 한국초등학교" />
      </div>
      <div class="title">테스트 날짜</div>
      <div class="item">
        <sui-input placeholder="예) 한국초등학교" />
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        electron: process.versions.electron,
        name: this.$route.name,
        node: process.versions.node,
        path: this.$route.path,
        platform: require('os').platform(),
        vue: require('vue/package.json').version,
      };
    },
  };
</script>

<style scoped>
  .title {
    color: #888;
    font-size: 18px;
    font-weight: initial;
    letter-spacing: .25px;
    margin-top: 10px;
  }

  .items { margin-top: 8px; }

  .item {
    display: flex;
    margin-bottom: 6px;
  }

  .item .name {
    color: #6a6a6a;
    margin-right: 6px;
  }

  .item .value {
    color: #35495e;
    font-weight: bold;
  }
</style>
