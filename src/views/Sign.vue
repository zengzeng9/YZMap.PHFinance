<template>
  <div></div>
</template>
<script>
import mixin from '@/mixins'
export default {
  mixins: [mixin],
  async created () {
    await this.login()
  },
}
</script>
<style lang="scss" scoped>

</style>