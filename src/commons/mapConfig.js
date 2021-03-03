export const mapConfig = {
  center: [28.21, 113],
  zoomLevel: 10,
  doubleClickZoom: false,
  zoomControl: false,
  control: [
    // {
    //   name: "search",
    //   alias: "搜索",
    //   options: {
    //     url: "/apps/address/api/match",
    //     // width: "200px",
    //     // height: "30px",
    //     // top: "20px",
    //     // left: "20px",
    //     rows: 10
    //   }
    // },
    {
      name: "toolPanel",
      alias: "工具栏",
      options: {
        // height: "30px",
        // right: "20px",
        // top: "20px"
      },
      children: [
        // {
        //   name: "measure",
        //   alias: "测量",
        //   options: {}
        // },
        {
          name: "location",
          alias: "定位",
          options: {}
        },
      //   {
      //     name: "bookmark",
      //     alias: "书签",
      //     options: {}
      //   },
      //   {
      //     name: "setMark",
      //     alias: "标记",
      //     options: {}
      //   },
      //   {
      //     name: "drawTool",
      //     alias: "标绘",
      //     options: {}
      //   },
      //   {
      //     name: "regionNav",
      //     alias: "地区",
      //     options: {}
      //   }
      ]
    },
    // {
    //   name: "layer",
    //   alias: "图层",
    //   options: {}
    // },
    // {
    //   name: "zoom",
    //   alias: "缩放",
    //   options: {}
    // }
  ]
};
