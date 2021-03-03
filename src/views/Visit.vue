<template>
  <div>
    <div class="visit-nav">
      <el-button
        @click="Click('day')"
        :class="currentType === 'day' ? 'selected' : 'unselected'"
        type="primary"
        size="mini"
        >当日</el-button
      >
      <el-button
        @click="Click('week')"
        :class="currentType === 'week' ? 'selected' : 'unselected'"
        type="primary"
        size="mini"
        >本周</el-button
      >
      <el-button
        @click="Click('month')"
        :class="currentType === 'month' ? 'selected' : 'unselected'"
        type="primary"
        size="mini"
        >本月</el-button
      >
      <el-button
        @click="Click('year')"
        :class="currentType === 'year' ? 'selected' : 'unselected'"
        type="primary"
        size="mini"
        >本年</el-button
      >
      <span v-if="currentType === 'day'">{{
        `*当日统计数据为前一日走访数据`
      }}</span>
      <span>{{ "*点击市州可以查看区县详情" }}</span>
    </div>
    <div class="visit-map">
      <CommonMap ref="commonMap" :config="config" />
    </div>
    <div class="visit-table">
      <div class="visit-table-header">
        <span>走访统计</span>
        <span>单位：户</span>
      </div>
      <div class="visit-table-content">
        <el-table
          :data="tableData"
          :header-cell-style="headerStyle"
          style="width: 100%; font-size: 12px"
          :row-class-name="tableRowClassName"
        >
          <el-table-column
            prop="index"
            label="序号"
            width="50"
            type="index"
          ></el-table-column>
          <el-table-column
            prop="busiCircleCustomer"
            label="商圈客户"
            width="80"
          ></el-table-column>
          <el-table-column
            prop="comCustomer"
            label="园区客户"
            width="80"
          ></el-table-column>
          <el-table-column
            prop="expLoanCustomer"
            label="消费贷客户"
            width="90"
          ></el-table-column>
          <el-table-column
            prop="priCustomer"
            label="个金电联客户"
            width="110"
          ></el-table-column>
          <el-table-column prop="total" label="合计"></el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
<script>
import { transformGCJ2WGS } from '@/commons/util.js'
import mixin from "@/mixins";
export default {
  mixins: [mixin],
  data() {
    return {
      currentType: "day",
      tableData: [
        {
          busiCircleCustomer: "8",
          comCustomer: "10",
          expLoanCustomer: "20",
          priCustomer: "5",
          total: "43",
        },
        {
          busiCircleCustomer: "8",
          comCustomer: "10",
          expLoanCustomer: "20",
          priCustomer: "5",
          total: "43",
        },
        {
          busiCircleCustomer: "8",
          comCustomer: "10",
          expLoanCustomer: "20",
          priCustomer: "5",
          total: "43",
        },
        {
          busiCircleCustomer: "8",
          comCustomer: "10",
          expLoanCustomer: "20",
          priCustomer: "5",
          total: "43",
        },
      ],
      map: null,
      currentLatlng: null
    };
  },
  async beforeMount() {
    await this.login();
  },
  async mounted() {
    this.map = this.$refs.commonMap && this.$refs.commonMap.map;
    this.locate()
  },
  methods: {
    tableRowClassName({ row, rowIndex }) {
      console.log(row);
      if (rowIndex === 1) {
        return "warning-row";
      } else if (rowIndex === 3) {
        return "success-row";
      }
      return "";
    },
    Click(type) {
      this.currentType = type;
      switch (type) {
        case "day":
          console.log("week");
          break;
        case "week":
          console.log("week");
          break;
        case "month":
          console.log("day");
          break;
        case "year":
          console.log("day");
          break;
      }
    },
    async getMapRegionData() {
      // eslint-disable-next-line no-undef
      const result = await api.getMapRegionData({});
      if (result && result.data) {
        this.showRegionOnMap(result.data);
      }
    },
    showRegionOnMap(data) {
      console.log(data);
      // this.map
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
<style lang="scss" scoped>
.visit-nav {
  top: 15px;
  left: 15px;
  position: absolute;
  z-index: 1000;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  .unselected {
    background: white;
    border: solid 1px #b3b3b3;
    border-radius: 10px;
    color: black;
  }
  .selected {
    background: #009669;
    border: solid 1px #009669;
    color: white;
    border-radius: 10px;
  }
  :nth-child(5) {
    margin-top: 5px;
  }
  span {
    display: block;
    text-align: left;
    line-height: 25px;
    font-size: 10px;
  }
}
.visit-map {
  width: 100%;
  position: absolute;
  height: 70%;
}
.visit-table {
  position: absolute;
  width: 100%;
  top: 70%;
  .visit-table-header {
    :first-child {
      float: left;
    }
    :last-child {
      text-align: right;
    }
    span {
      display: block;
      font-size: 14px;
      font-weight: bold;
      line-height: 40px;
      margin: 0 5px;
    }
  }
}
</style>