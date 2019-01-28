<template>
  <div class="button container">
    <sui-button
      :id="id"
      class="move-button"
      :color="color"
      :size="size"
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
      color: {
        default: 'black',
      },
      size: {
        default: 'massive',
      },
      id: {
        default: '',
      }
    },
    methods: {
      async onClick() {
        await this.beforeMove();
        this.$router.push(this.route);
      },
    },
  };
</script>
