import BzAlert from './bz-alert'
import Vue from 'vue'

BzAlert.newInstance = properties => {
  const props = properties || {}
  const Instance = new Vue({
    data: props,
    render (h) {
      return h(BzAlert, {
        props: props
      })
    }
  })

  const component = Instance.$mount()
  document.body.appendChild(component.$el)
  const alert = Instance.$children[0]

  return {
    add (noticeProps) {
      alert.add(noticeProps)
    },
    remove (name) {
      alert.remove(name)
    }
  }
}

export default BzAlert
