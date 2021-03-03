<template>
  <h3 v-if="code === '0'">您未登录，不能访问当前页面</h3>
  <h3 v-else-if="code === '1'">您账号或者密码错误</h3>
  <h3 v-else-if="code === '2'">您登录信息过期，请重新登录</h3>
  <h3 v-else-if="code === '3'">您无权限查看此页面</h3>
  <h3 v-else-if="code === '4'">您账号在别处登录，请重新登录</h3>
  <h3 v-else-if="code === '401'">未授权,请重新登录</h3>
  <h3 v-else-if="code === '404'">未找到</h3>
  <h3 v-else-if="code === '403'">禁止访问</h3>
  <h3 v-else>未知错误，请联系管理员</h3>
  
</template>
<script>
import mixin from '@/mixins'
export default {
  mixins: [mixin],
  mounted () {
    this.code = this.$route.query.code.toString()
  }
}
</script>
<style lang="scss" scoped>

</style>