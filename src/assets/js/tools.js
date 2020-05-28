export function isPhone (w) {
  let width = document.documentElement.clientWidth || document.body.clientWidth
  return width <= w
}

export function sleep (delay) {
  var start = (new Date()).getTime()
  while ((new Date()).getTime() - start < delay) {
    continue
  }
}

export function findIndexById (id, array) {
  return array.findIndex(item => {
    if (item.children) {
      findIndexById(id, item.children)
    }
    return item.id === id
  })
}

export function dClone (obj) {
  return JSON.parse(JSON.stringify(obj))
}
