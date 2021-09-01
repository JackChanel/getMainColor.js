  /**
   * easyColor.js 根据 GitHub 上 Ele-Peng/miniprogram-pallet 项目所封装。
   * 适配于微信小程序，用于取图片主色调的工具。
   * 更新仓库地址：https://github.com/Labraff/getMainColor.js.git
   * 
   * 基本参数
   * @imgPath 图片路径
   * @res canvas上下文
   * 
   * 使用方法
   * promise回调
   * mainGetColor(res,imgPath).then((res) =>{ // do anything })
   */

  const COLOR_SIZE = 40 // 单位色块的大小（像素个数，默认40）。以单位色块的平均像素值为作为统计单位
  const LEVEL = 32 // 色深，颜色分区参数（0-255），总256，2^8，即8bit，4个通道（rgba），即默认色深4*8bit，32bit
  // 分区块，可以拓展性的求主要色板，用来做palette

  let mainGetColor = (res, imgPath) => {
    return new Promise((resolve, reject) => {
      const canvas = res[0].node
      const ctx = canvas.getContext('2d')
      const img = canvas.createImage()
      img.src = imgPath
      img.onload = () => {
        ctx.drawImage(img, 0, -50, 100, 100);
        let imageData = ctx.getImageData(0, 0, 50, 50).data
        const mapData = getLevelData(imageData);
        const colors = getMostColor(mapData);
        if (!colors) {
          return
        } else {
          const color = getAverageColor(colors)
          let rgb = `rgb(${color.r},${color.g},${color.b},${color.a})`
          resolve(rgb)
        }
      }
    })
  }


  // 获取每段的颜色数据
  // 根据像素数据，按单位色块进行切割
  let getLevelData = (imageData) => {
    const len = imageData.length;
    const mapData = {};
    for (let i = 0; i < len; i += COLOR_SIZE * 4) {
      const blockColor = getBlockColor(imageData, i); // 该区块平均rgba [{r,g,b,a}]数据
      // 获取各个区块的平均rgba数据，将各个通道的颜色进行LEVEL色深降级
      // 根据r_g_b_a 建立map索引
      const key = getColorLevel(blockColor);
      !mapData[key] && (mapData[key] = []);
      mapData[key].push(blockColor);
    }
    return mapData;
  }

  // 获取单位块的全部色值
  // 并根据全部色值，计算平均色值
  // 处理最后边界值，小于COLOR_SIZE
  let getBlockColor = (imageData, start) => {
    let data = [],
      count = COLOR_SIZE,
      len = COLOR_SIZE * 4;
    imageData.length <= start + len && (count = Math.floor((imageData.length - start - 1) / 4));
    for (let i = 0; i < count; i += 4) {
      data.push({
        r: imageData[start + i + 0],
        g: imageData[start + i + 1],
        b: imageData[start + i + 2],
        a: imageData[start + i + 3]
      })
    }
    return getAverageColor(data);
  }

  // 取出各个通道的平均值，即为改色块的平均色值
  let getAverageColor = (colorArr) => {
    const len = colorArr.length;
    let sr = 0,
      sg = 0,
      sb = 0,
      sa = 0;
    colorArr.map(function (item) {
      sr += item.r;
      sg += item.g;
      sb += item.b;
      sa += item.a;
    });
    return {
      r: Math.round(sr / len),
      g: Math.round(sg / len),
      b: Math.round(sb / len),
      a: Math.round(sa / len)
    }
  }

  let getColorLevel = (color) => {
    return getLevel(color.r) + '_' + getLevel(color.g) + '_' + getLevel(color.b) + '_' + getLevel(color.a)
  }

  // 色深降级
  let getLevel = (value) => {
    return Math.round(value / LEVEL)
  }

  // 根据色块颜色，获取
  let getMostColor = (colorData) => {
    let rst = null,
      len = 0;
    for (let key in colorData) {
      colorData[key].length > len && (
        rst = colorData[key],
        len = colorData[key].length
      )
    }
    return rst;
  }

  module.exports = {
    mainGetColor: mainGetColor
  }