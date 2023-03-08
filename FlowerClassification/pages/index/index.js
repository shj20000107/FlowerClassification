// index.js
var app = getApp();
var that = '';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    img: '/image/test_default.jpg',
    imgB64: '',
    content: '',
    ishow: false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this;
  },
  /**
   * 选择图片
   */
  chooseimgTap: function() {
    that.setData({
      ishow: false,
      content: ''
    });
    wx.chooseMedia({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        console.log(res)
        const tempFilePaths = res.tempFiles[0].tempFilePath;
        that.getB64ByUrl(tempFilePaths);
        that.setData({
          img: tempFilePaths
        });
      }
    })
  },
  /**
   * 转b64
   */
  getB64ByUrl: function(url) {
    const FileSystemManager = wx.getFileSystemManager();
    FileSystemManager.readFile({
      filePath: url,
      encoding: 'base64',
      success(res) {
        // console.log(res.data);
        that.setData({
          imgB64: res.data
        });
      }
    })
  },
 
  /**
   * 植物识别
   */
  plantTap: function(e) {
    const imgB64 = that.data.imgB64;
    if (!imgB64) {
      that.setData({
        ishow: true
      });
      return;
    };
 
    that.getToken(function(token) {
      that.getResult(token);
    });
  },
  getToken: function(callback) {
    wx.request({
      url: 'https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=xBh7pGE3HaUrGz8KwwLYzHC5&client_secret=czGqX9XKAUvKakSHtq3fSTOzGq3kexzF',
      data: {},
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success(res) {
        var token = res.data.access_token;
        console.log(token);
 
        return callback(token);
      }
    });
  },
  getResult: function(token) {
    wx.request({
      url: 'https://aip.baidubce.com/rest/2.0/image-classify/v1/plant?access_token=' + token, //仅为示例，并非真实的接口地址
      method: "post",
      data: {
        image: that.data.imgB64
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success(res) {
        that.setData({
          content: res.data.result[0].name
        });
      }
    });
  }
})