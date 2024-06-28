<template>
  <div>
    <button v-on:click="count++">You clicked me {{ count }} times.</button>
  </div>
</template>

<script>
  export default {
    props: {
      prefix: String
    },
    data: function () {
      return {
        count: 0
      }
    },
}
</script>

<style lang="scss" scoped>

</style>
