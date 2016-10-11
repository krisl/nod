const morphdom = require('morphdom')
const hyperx = require('hyperx')
const bel = require('bel')

const foreverTrue = () => true

function makeNode (tagName, attrs) {
  return bel.createElement(tagName, attrs)
}

const makeIsSameNode = (untracked) => function (node) {
  return untracked(() => {
    const same = JSON.stringify(node.argMap) === JSON.stringify(this.argMap)
    if (!same && node.disposer) node.disposer()
    return same
  })
}

const makeProxyNode = (onload, isSameNode) => function (fn) {
  const proxy = makeNode('span', {onload})
  proxy.isSameNode = isSameNode
  proxy.fn = fn

  return proxy
}

const makeAutorun = (autorun) => function (proxyNode) {
  let node = proxyNode
  const fn = proxyNode.fn
  const disposer = autorun(() => {
    node = morphdom(node, fn())
  })
  node.fn = fn
  node.disposer = disposer
}

const makeProxyMapper = (buildProxyNode) =>
  node => typeof node === 'function' ? buildProxyNode(node) : node

const makeH = (proxyMapper) => function (tagName, attrs, children) {
  const proxiedChildren = Array.prototype.concat.apply([], children).map(proxyMapper)
  return bel.createElement(tagName, attrs, proxiedChildren)
}

module.exports = (autorun) => {
  const onload = makeAutorun(autorun)
  const buildProxyNode = makeProxyNode(onload, foreverTrue)
  return hyperx(makeH(makeProxyMapper(buildProxyNode)))
}
