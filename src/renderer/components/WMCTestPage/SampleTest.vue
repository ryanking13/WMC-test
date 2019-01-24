<template>
  <div>
    <h1 is="sui-header">{{ number }}</h1>

    <div class="container">
      <sui-button
        color="black"
        circular size="massive"
        @click="onStart"
      >
        시작하기
      </sui-button>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        numbers: [1, 2, 3, 4],
        number: '',
      };
    },
    methods: {
      onStart() {
        this.changeNumbers(10);
      },
      changeNumbers(c) {
        setTimeout(() => {
          this.number = Math.floor(Math.random() * 11);
          if (c > 0) {
            c -= 1;
            this.changeNumbers(c);
          }
        }, 1000);
      },
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
