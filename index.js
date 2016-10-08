const morphdom = require('morphdom')
const hyperx = require('hyperx')
const mobx = require('mobx')
const bel = require('bel')

const foreverTrue = () => true

function newProxyNode () {
  return bel.createElement('span', {onload: autorun})
}

function proxyNode (fn) {
  const proxy = newProxyNode()
  proxy.isSameNode = foreverTrue

  fn.node = proxy
  fn.node.fn = fn

  return proxy
}

function autorun (node) {
  mobx.autorun(() => {
    const fn = node.fn
    fn.node = morphdom(fn.node, fn())
  })
}

function h (tagName, attrs, children) {
  const proxiedChildren = children && children.map(
    node => typeof node === 'function' ? proxyNode(node) : node
  )
  return bel.createElement(tagName, attrs, proxiedChildren)
}

const nod = hyperx(h)

module.exports = nod
