<template>
  <sui-label
    size="standard"
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
        default: 'yellow',
      },
      pointing: {
        default: 'above',
      },
    },
  };
</script>
