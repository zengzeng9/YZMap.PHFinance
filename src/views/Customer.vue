<template>
  <div>
    <CommonMap :config="config" ref="CommonMap" />
    <div class="customer_header">
      <div class="h1">
        <el-input
          placeholder="请输入客户名称"
          v-model="input"
          clearable
          class="search"
          @change="getDataByName"
        >
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
        <div
          :style="{
            color: active ? '#228834' : 'rgb(117,117,117)',
            fontSize: '16px',
          }"
          @click="active = !active"
        >
          筛选
        </div>
      </div>

      <el-cascader-panel
        :options="options"
        v-if="active"
        v-model="regionVal"
        @change="showVal"
      ></el-cascader-panel>
    </div>
    <div
      style="
        overflow: hidden;
        background-color: transparent;
        z-index: 999;
        width: 100%;
        position: fixed;
        top: calc(95% - 56px);
      "
      ref="locate"
    >
      <img
        src="@/assets/locate@2x.png"
        width="56px"
        style="float: right"
        @click="locate"
      />
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
        :key="updateDistance"
      >
        <div class="item" v-for="item in result" :key="item.id">
          <div class="title">
            <span class="title_left">{{ item.customerName }}</span
            ><span class="title_right" @click="toDetail(item.id)"
              >详情&nbsp;&nbsp;<img
                width="16px"
                style="vertical-align: text-bottom"
                src="@/assets/arrow@2x.png"
              />
            </span>
            <div style="clear: both"></div>
          </div>
          <div class="detail">
            <div>
              <div class="d1">客户姓名：张卡</div>
              <div class="d1">客户类型：张卡</div>
              <div class="d1">跟进日期：2021-01-22</div>
              <div class="d1">
                {{
                  item.distance > 1000
                    ? (item.distance / 1000).toFixed(2)
                    : (item.distance / 1).toFixed(0)
                }}{{ item.distance > 1000 ? "公里" : "米" }}&nbsp;|&nbsp;{{
                  item.address
                }}
              </div>
            </div>
            <div style="margin-right: 8px; text-align: right">
              <img width="28px" height="28px" src="@/assets/zou_fang@2x.png" />
              <div
                style="
                  height: 17px;
                  line-height: 17px;
                  font-family: PingFang, PingFang-SC;
                  font-size: 12px;
                  font-weight: sc;
                  color: #999999;
                  text-align: center;
                "
              >
                {{ item.identificationNumber }}次
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
import { transformGCJ2WGS } from "@/commons/util.js";
import mixin from "@/mixins";
import api from "@/commons/api.js";
export default {
  mixins: [mixin],
  data() {
    return {
      config: {
        control: [],
      },
      input: "",
      result: [],
      active: false,
      options: [],
      all: 0,
      result2: [],
      regionVal: [],
      show_msg: false,
      currentLatlng: null,
      updateDistance: 0,
      locationMarker: null,
    };
  },
  mounted() {
    this.currentLatlng=YZ.latLng(22.111,111.123)
    this.locate();
  },
  // watch:{
  //   mylatlng(val){
  //     this.forLocation(val)
  //   }
  // },
  async created() {
    if (!this.login()) return;

    let result = await api.getRegionCustomerCount();
    if (result.code == 200) {
      let info = result.data;
      let data = [
        {
          label:
            "全" +
            info.districtName +
            "(" +
            (info.customerCount != null ? info.customerCount : 0) +
            ")",
          value: info.districtCode,
        },
      ];
      info.childrenList.forEach((item) => {
        let a = {};

        a["label"] =
          item.districtName +
          "(" +
          (item.customerCount != null ? item.customerCount : 0) +
          ")";
        a["value"] = item.districtCode;
        if (item.childrenList) {
          a["children"] = [
            {
              label:
                "全" +
                item.districtName +
                "(" +
                (item.customerCount != null ? item.customerCount : 0) +
                ")",
            },
          ];

          if (item.childrenList) {
            item.childrenList.forEach((item2) => {
              a["children"].push({
                label:
                  item2.districtName +
                  "(" +
                  (item2.customerCount != null ? item2.customerCount : 0) +
                  ")",
                value: item2.districtCode,
              });
            });
          }
        }

        data.push(a);
      });
      this.options = data;
    } else
      this.$router.push({
        name: "map-authorization",
        query: { code: result.code },
      });
  },
  methods: {
    toDetail(businessId) {
      document.location = `js://customerDetial:{"businessId":"${businessId}"}`;
    },
    forLocation(latlng) {
      latlng = transformGCJ2WGS(latlng.lat, latlng.lng);
      // eslint-disable-next-line no-undef
      this.currentLatlng = YZ.latLng(latlng.lat, latlng.lon);
      this.$refs.CommonMap.map.flyTo(this.currentLatlng, 16);
      if (this.locationMarker == null) {
        // eslint-disable-next-line no-undef
        let myIcon = YZ.divIcon({
          className: "my-div-icon",
          html: '<img src="./images/icon-green@2x.png" width="28px" />',
          iconAnchor: [14, 28],
        });

        // eslint-disable-next-line no-undef
        this.locationMarker = YZ.marker(this.currentLatlng, {
          icon: myIcon,
        });
        this.locationMarker.addTo(this.$refs.CommonMap.map);
      } else {
        this.locationMarker.setLatLng(this.currentLatlng);
      }

      if (this.result.length) {
        this.updateDistance++;
        this.result.forEach((item) => {
          item["distance"] = this.currentLatlng.distanceTo(
            item.center.split(",").reverse()
          );
        });
      }
    },
    locate() {
      // document.location = "js://location:";
      this.$root.$on("locate", this.forLocation);
    },
    showVal() {
      this.active = false;
      this.getData({
        regionCode: this.regionVal.pop(),
      });
    },
    getDataByName() {
      this.getData({
        customerName: this.input,
      });
    },
    async getData(req) {
      let result = await api.getCustomer(req);
      if (result.code == 200) {
        this.result = result.data;
        this.result.forEach((item) => {
          item["distance"] = this.currentLatlng.distanceTo(
            item.center.split(",").reverse()
          );
        });

        this.result2 = this.result;
        // eslint-disable-next-line no-undef
        let myIcon = YZ.divIcon({
          className: "my-div-icon",
          html: '<img src="./images/marker-icon.png" width="28px" />',
        });
        // eslint-disable-next-line no-undef
        let markers = new YZ.MarkerClusterGroup();
        this.result.forEach((item) => {
          let latlng = item.center.split(",").reverse();
          markers.addLayer(
            // eslint-disable-next-line no-undef
            YZ.marker(latlng, {
              icon: myIcon,
            })
          );
        });
        this.$refs.CommonMap.map.flyToBounds(markers.getBounds());
        let that = this;
        markers.on("clusterclick", function (a) {
          that.$refs.info.style.top = "65%";
          that.$refs.info.style.height = "35%";
          that.$refs.locate.style.top =
            document.documentElement.clientHeight * 0.65 - 56 + "px";
          that.result = [];
          a.layer.getAllChildMarkers().forEach((marker) => {
            that.result2.forEach((item) => {
              let latlng = item.center.split(",").reverse();
              if (
                marker.getLatLng().lat == latlng[0] &&
                marker.getLatLng().lng == latlng[1]
              )
                that.result.push(item);
            });
          });
        });
        markers.on("click", function (a) {
          that.$refs.info.style.top = "65%";
          that.$refs.info.style.height = "35%";
          that.$refs.locate.style.top =
            document.documentElement.clientHeight * 0.65 - 56 + "px";
          that.result = that.result2.filter((item) => {
            let latlng = item.center.split(",").reverse();
            return (
              a.layer.getLatLng().lat == latlng[0] &&
              a.layer.getLatLng().lng == latlng[1]
            );
          });
        });
        markers.addTo(this.$refs.CommonMap.map);
        if (this.result.length)
          this.$refs.CommonMap.map.fitBounds(markers.getBounds());
      } else
        this.$router.push({
          name: "map-authorization",
          query: { code: result.code },
        });
    },
    showMsg() {
      this.show_msg = !this.show_msg;
      let height = document.documentElement.clientHeight;
      if (this.show_msg) {
        this.$refs.info.style.top = "65%";
        this.$refs.info.style.height = "35%";
        this.$refs.locate.style.top = height * 0.65 - 56 + "px";
      } else {
        this.$refs.info.style.top = "95%";
        this.$refs.info.style.height = "5%";
        this.$refs.locate.style.top = height * 0.95 - 56 + "px";
      }
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
    padding-left: 20px;
    .search {
      width: 80%;
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

  div.el-cascader-panel.is-bordered {
    border-top: none;
    text-align: left;
  }
  div.el-scrollbar__thumb {
    display: none;
  }

  ul.el-scrollbar__view.el-cascader-menu__list {
    li.el-cascader-node {
      padding: 0;
      i.el-cascader-node__postfix {
        display: none;
      }
      i.el-icon-check.el-cascader-node__prefix {
        display: none;
      }
      span.el-cascader-node__label {
        white-space: pre-wrap;
        line-height: 16px;
      }
    }
    li.is-active,
    li.in-active-path {
      color: rgb(0, 152, 109);
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
      display: flex;
      justify-content: space-between;
      align-items: center;
      .d1 {
        height: 18px;
        font-size: 13px;
        font-family: PingFang, PingFang-SC;
        font-weight: SC;
        text-align: left;
        color: #666666;
        line-height: 18px;
      }
    }
  }
  .item:last-child {
    border-bottom: none;
  }
}
</style>