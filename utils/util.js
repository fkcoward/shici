const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const getShiciByTitle=title=>{
  wx.cloud.callFunction({
    // 云函数名称
    name: 'getByTitle',
    // 传给云函数的参数
    data: {
      title: title
    },
    success: (res) => {
      console.log(res);
    },
    fail: console.error
  })
}


module.exports = {
  formatTime: formatTime,
  getShiciByTitle: getShiciByTitle
}

