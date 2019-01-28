<template>
  <sui-label
    :size="size"
    :color="color"
    v-show="condition"
    :pointing="pointing"
  >
    {{ msg }}
  </sui-label>
</template>

<script>
  export default {
    props: {
      condition: {
        default: true,
      },
      msg: {
        default: '',
      },
      color: {
        default: 'orange',
      },
      pointing: {
        default: 'above',
      },
      size: {
        default: 'large',
      }
    },
  };
</script>
