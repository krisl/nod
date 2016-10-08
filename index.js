const morphdom = require('morphdom')
const hyperx = require('hyperx')
const bel = require('bel')

const foreverTrue = () => true

function makeNode (tagName, attrs) {
  return bel.createElement(tagName, attrs)
}

function proxyNode (fn, onload) {
  const proxy = makeNode('span', {onload})
  proxy.isSameNode = foreverTrue

  fn.node = proxy
  fn.node.fn = fn

  return proxy
}

const makeAutorun = (autorun) => function (node) {
  autorun(() => {
    const fn = node.fn
    fn.node = morphdom(fn.node, fn())
  })
}

const makeH = (autorun) => function (tagName, attrs, children) {
  const proxiedChildren = children && children.map(
    node => typeof node === 'function' ? proxyNode(node, autorun) : node
  )
  return bel.createElement(tagName, attrs, proxiedChildren)
}

module.exports = (autorun) => hyperx(makeH(makeAutorun(autorun)))
