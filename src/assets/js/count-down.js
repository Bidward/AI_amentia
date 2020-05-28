export function padDate (num) {
  return num >= 10 ? num : '0' + num
}

export function formatDate (val) {
  let value = new Date(val)
  let year = value.getFullYear()
  let month = padDate(value.getMonth() + 1)
  let day = padDate(value.getDate())
  let hour = padDate(value.getHours())
  let minutes = padDate(value.getMinutes())
  let seconds = padDate(value.getSeconds())
  return year + '/' + month + '/' + day + ' ' + hour + ':' + minutes + ':' + seconds
}

export function formatCountDown (timestamp) {
  let timeDiff = timestamp / 1000
  if (timeDiff <= 0) {
    return false
  }
  let day = parseInt(timeDiff / (3600 * 24))

  let hour = parseInt(timeDiff / 3600 % 24)
  hour = padDate(hour)

  let minute = parseInt(timeDiff / 60 % 60)
  minute = padDate(minute)

  let second = parseInt(timeDiff % 60)
  second = padDate(second)

  return { day, hour, minute, second }
}

// export function isPhone() {
//   let width = document.documentElement.clientWidth||document.body.clientWidth
//   console.log(width)
//   return width < 750
// }
