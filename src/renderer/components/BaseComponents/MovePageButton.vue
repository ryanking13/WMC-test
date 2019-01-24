<template>
  <div class="button container">
    <sui-button
      color="black"
      size="huge"
      @click="onClick"
      :disabled="!enabled"
    >
    <div v-if="msg !== null">
      {{ msg }}
    </div>
    <div v-else>
      <v-icon name="arrow-right" scale="3"/>
    </div>
    </sui-button>
  </div>
</template>

<script>
  export default {
    props: {
      route: {
        default: '/',
      },
      beforeMove: {
        default: () => (() => {}),
      },
      msg: {
        default: null,
      },
      enabled: {
        default: true,
      },
    },
    methods: {
      async onClick() {
        await this.beforeMove();
        this.$router.push(this.route);
      },
    },
  };
</script>
