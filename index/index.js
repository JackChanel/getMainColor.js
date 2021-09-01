import mainColor from './easyColor'
let app =  getApp();
Page({

  data: {
    rgb: [],
    imagePathArray: ["https://cdn.nlark.com/yuque/0/2021/png/1728867/1630484792238-71d018f5-ade2-4bf2-b7b8-cf5e1c4722a9.png", "https://cdn.nlark.com/yuque/0/2021/png/1728867/1627903562125-dacb4af0-c300-4f05-a413-eeea00366ab5.png", "https://cdn.nlark.com/yuque/0/2021/png/1728867/1627811501017-9fc01297-1fe4-4007-bb9f-a7322f9a1041.png"],

  },

  onLoad: function (options) {
  },

  onReady: function () {
    for (let item of this.data.imagePathArray) {
      console.log(item);
      this.getMainColor(item).then((res) => {
        console.log(res);
        this.data.rgb.push(res)
        this.setData({
          rgb: this.data.rgb
        })
      })
    }
  },

  getMainColor(imgPath) {
    return new Promise((resolve) => {
      const query = wx.createSelectorQuery()
      query.select('#myCanvas')
        .fields({
          node: true,
          size: true
        })
        .exec((res) => {
          mainColor.mainGetColor(res,imgPath).then((ret) => {
            resolve(ret);
          })
        })
    })
  },



})