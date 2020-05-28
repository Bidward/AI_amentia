import html2canvas from 'html2canvas'
/**
 *
 * @param {*} domId
 * @param {*} picName
 */
const dom2Pic = function (domId, picName = '未命名.png') {
  let dom = document.querySelector(domId)
  html2canvas(dom).then(canvas => {
    let imageData = canvas.toDataURL('image/png')
    fileDownload(imageData, picName)
  })
}

function fileDownload (base64Data, picName) {
  let aLink = document.createElement('a')
  aLink.style.display = 'none'
  aLink.href = base64Data
  aLink.download = picName
  // 触发点击-然后移除
  document.body.appendChild(aLink)
  aLink.click()
  document.body.removeChild(aLink)
}
export default dom2Pic
