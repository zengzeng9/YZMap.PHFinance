<template>
  <div>
    <CommonMap :config="config" ref="CommonMap" />
    <div class="customer_header">
      <div class="h1">
        <el-input
          placeholder="搜索词"
          v-model="input"
          clearable
          class="search"
          @change="getData"
        >
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
      </div>
    </div>
    <div class="customer_info" ref="info">
      <div
        style="
          height: 8px;
          width: 20%;
          background: rgb(200, 200, 200);
          border-radius: 999px;
          margin: 5px auto;
          font-size: 6px;
        "
        @click="showMsg"
      ></div>
      <div
        style="overflow: scroll; height: calc(100% - 15px); background: #fff"
        v-if="result.length"
      >
        <div class="item" v-for="item in result" :key="item.customerId">
          <div class="title">
            <div class="title_left">
              {{ item.customerName }}&nbsp;&nbsp;<span
                style="
                  color: #ff6c00;
                  border: 1px solid #ff6c00;
                  border-radius: 6px;
                  font-size: 12px;
                  font-weight: 400;
                  padding: 0 3px;
                "
                >{{ item.productName }}</span
              >
            </div>
            <span
              class="title_right"
              @click="toDetail(item.customerId, item.infoId)"
              >详情&nbsp;&nbsp;<img
                width="13px"
                style="vertical-align: middle"
                src="@/assets/Icon-xiayiji@2x.png"
              />
            </span>
            <div style="clear: both"></div>
          </div>
          <div class="detail">
            <div style="width: 100%">
              <div class="d1">
                逾期金额<span style="color: red">{{ item.overduelAmount }}</span
                >元，逾期<span style="color: red">{{ item.overduelDay }}</span
                >天
              </div>
              <div class="d1">{{ item.address }}</div>
              <div
                style="
                  display: flex;
                  justify-content: space-around;
                  margin-top: 5px;
                "
              >
                <div
                  class="d2"
                  style="background: #edfff6"
                  @click="callPhone(item.phonenumber)"
                >
                  <img
                    width="16px"
                    src="@/assets/call@2x.png"
                    style="vertical-align: text-bottom; margin-right: 7px"
                  />一键拨号
                </div>
                <div class="d2" style="background: #fffcea">
                  <img
                    width="16px"
                    src="@/assets/Icon-cuishou@2x.png"
                    style="vertical-align: text-bottom; margin-right: 7px"
                  />上门催收
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else style="margin-top: 4%">暂无数据</div>
    </div>
  </div>
</template>
<script>
import { transformGCJ2WGS } from '@/commons/util.js'
import mixin from "@/mixins";
import api from "@/commons/api.js";
export default {
  mixins: [mixin],
  mounted() {
    this.locate();
  },
  data() {
    return {
      config: {
        control: [],
      },
      input: "",
      result: [],
      result2: [],
      show_msg: false,
      currentLatlng: null,
    };
  },
  async created() {
    //从url获取token
    if (!this.login()) return;
  },
  methods: {
    callPhone(phonenumber) {
      document.location = `js://overdueCall:{"phoneNum":"${phonenumber}"}`;
    },
    toDetail(arg1, arg2) {
      document.location = `js://webview:{"customerId":"${arg1}","infoId":"${arg2}"}`;
    },
    async getData() {
      //让键盘收起
      document.querySelector("input").blur();
      this.$refs.info.style.top = "65%";
      this.$refs.info.style.height = "35%";

      let cityCode = this.$route.query.cityCode;

      let result = await api.overdueMap({
        cityCode,
        cityName: "",
        gpsAddress: "",
        customerName: this.input,
      });
      if (result.code == 200) {
        this.result = result.data.records;
        this.result2 = this.result;
        // eslint-disable-next-line no-undef
        let myIcon = YZ.divIcon({
          className: "my-div-icon",
          html: '<img src="./images/icon-green@2x.png" width="28px" />',
        });
        // eslint-disable-next-line no-undef
        let markers = new YZ.MarkerClusterGroup();
        this.result.forEach((item) => {
          if (!item.gpsAddress) return;
          let latlng = item.gpsAddress.split(",").reverse();
          markers.addLayer(
            // eslint-disable-next-line no-undef
            YZ.marker(latlng, {
              icon: myIcon,
            })
          );
        });

        let that = this;
        markers.on("clusterclick", function (a) {
          that.result = [];
          a.layer.getAllChildMarkers().forEach((marker) => {
            that.result2.forEach((item) => {
              if (!item.gpsAddress) return;
              let latlng = item.gpsAddress.split(",").reverse();
              if (
                marker.getLatLng().lat == latlng[0] &&
                marker.getLatLng().lng == latlng[1]
              )
                that.result.push(item);
            });
          });
        });

        markers.on("click", function (a) {
          that.result = that.result2.filter((item) => {
            if (!item.gpsAddress)
              //过滤掉没有gpsAddress的项
              return;
            let latlng = item.gpsAddress.split(",").reverse();
            return (
              a.layer.getLatLng().lat == latlng[0] &&
              a.layer.getLatLng().lng == latlng[1]
            );
          });
        });

        markers.addTo(this.$refs.CommonMap.map);
        if (this.result.length)
          this.$refs.CommonMap.map.fitBounds(markers.getBounds());
      }
      //   else
      // this.$router.push({name: 'map-authorization', query: { code: result.code }})
    },
    showMsg() {
      this.show_msg = !this.show_msg;
      if (this.show_msg) {
        this.$refs.info.style.top = "65%";
        this.$refs.info.style.height = "35%";
      } else {
        this.$refs.info.style.top = "95%";
        this.$refs.info.style.height = "5%";
      }
    },
    forLocation(latlng) {
      
      latlng = transformGCJ2WGS(latlng.lat, latlng.lng)
      // eslint-disable-next-line no-undef
      this.currentLatlng = YZ.latLng(latlng.lat, latlng.lon);
      this.$refs.CommonMap.map.flyTo(this.currentLatlng, 16);
    },
    locate() {
      document.location = "js://location:";
      this.$root.$on("locate", this.forLocation);
    },
  },
};
</script>
<style lang="scss">
.marker-cluster-small,
.marker-cluster-medium,
.marker-cluster-large {
  background: #ffffff;
}
.customer_header {
  width: 100%;
  background: #ffffff;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;

  .h1 {
    display: flex;
    align-items: center;
    justify-content: space-around;
    height: 40px;
    .search {
      width: 90%;
      input {
        background-color: #f6f5f8;
        border-color: transparent;
        height: 28px;
        border-radius: 999px;
      }
      span>i.el-input__icon.el-icon-search{
        height: 30px;
        line-height: 30px;
      }
    }
  }
}
.customer_info {
  position: fixed;
  top: 95%;
  left: 0;
  z-index: 999;
  width: 100%;
  background: #fff;
  height: 5%;
  border-radius: 7px;
  .item {
    margin: 0 3%;
    padding: 14px 0;
    border-bottom: 1px solid rgb(193, 193, 193);
    text-align: left;
    .title {
      .title_left {
        float: left;
        height: 22px;
        font-family: PingFangSC, PingFangSC-Semibold;
        font-size: 16px;
        font-weight: 600;
        color: #333333;
        line-height: 22px;
      }
      .title_right {
        float: right;
        height: 18px;
        font-size: 13px;
        font-family: PingFang, PingFang-SC;
        font-weight: SC;
        text-align: right;
        color: #999999;
        line-height: 18px;
      }
    }
    .detail {
      margin-top: 3px;
      .d1 {
        height: 18px;
        font-size: 13px;
        font-family: PingFang, PingFang-SC;
        font-weight: SC;
        text-align: left;
        color: #333333;
        line-height: 18px;
        margin-top: 3px;
      }
      .d2 {
        width: 40%;
        height: 30px;
        opacity: 1;
        border-radius: 6px;
        text-align: center;
        line-height: 30px;
      }
    }
  }
  .item:last-child {
    border-bottom: none;
  }
}
</style>