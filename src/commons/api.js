import request from '@/axios/request.js'

export default {
  // login: async data => {
  //   const result = await request({
  //     url: '/login',
  //     data
  //   })
  //   return result || {}
  // },
  // getMapRegionData: async data => {
  //   const result = await request({
  //     url: '/region',
  //     data
  //   })
  //   return result || {}
  // },
  // getVisitTableData: async data => {
  //   const result = await request({
  //     url: '/visit',
  //     data
  //   })
  //   return result || {}
  // },
  getCustomer: async data => {
    const result = await request({
      url: '/visit/businessbase/selectCustomerByNameAndRegionCode',
      data
    })
    return result || {}
  },
  getRegionCustomerCount: 
  async data => {
    const result = await request({
      url: '/visit/businessbase/selectRegionCustomerCount',
      data
      
    })
    return result || {}
  },
  overdueMap:
  async data => {
    const result = await request({
      url: '/collection/app/overduelMap',
      data
      
    })
    return result || {}
  },
}