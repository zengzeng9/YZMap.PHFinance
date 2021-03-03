import { transformGCJ2WGS } from '@/commons/util.js'

export default {
  data() {
    const { mapConfig } = require("@/commons/mapConfig");
    return {
      user: null,
      code: '',
      config: mapConfig,
      headerStyle: {
        background: '#e3e3e3',
        color: '#555'
      },
    }
  },
  methods: {
    login() {
      this.user = this.$route.query

      if (!this.user.authorization) {
        this.code = 0  //未登录
        this.$router.push({ name: 'map-authorization', query: { code: this.code } })
        return false
      } else {

        sessionStorage.setItem('authorization', this.user.authorization)

        return true
      }

    }
  },
  mounted() {
    this.$root.$on('locate', function (args) {
      const pt = transformGCJ2WGS(args.lat, args.lng)
      this.mapConfig.center = { lat: pt.lat, lng: pt.lon } || this.mapConfig.center
    })
  }
}