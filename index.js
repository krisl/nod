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

const makeProxyNode = (onload, isSameNode) => function (fn, argMap, id) {
  const proxy = makeNode('span', {onload, id})
  proxy.isSameNode = isSameNode
  proxy.argMap = argMap
  proxy.fn = fn

  return proxy
}

const makeAutorun = (autorun) => function (proxyNode) {
  let argMap
  let node = proxyNode
  const fn = proxyNode.fn
  const disposer = autorun(() => {
    argMap = node.argMap
    node = morphdom(node, fn(argMap))
  })
  node.fn = fn
  node.argMap = argMap
  node.disposer = disposer
}

const makeProxyMapper = (buildProxyNode) =>
  node => typeof node === 'function' ? buildProxyNode(node) : node

const makeH = (proxyMapper, buildProxyNode) => function (tagName, attrs, children) {
  if (tagName === 'cache') {
    return buildProxyNode(attrs.func, attrs.params, attrs.id)
  }
  const proxiedChildren = Array.prototype.concat.apply([], children).map(proxyMapper)
  return bel.createElement(tagName, attrs, proxiedChildren)
}

module.exports = (autorun, untracked) => {
  const onload = makeAutorun(autorun)
  const buildProxyNode = makeProxyNode(onload, makeIsSameNode(untracked))
  return hyperx(makeH(makeProxyMapper(buildProxyNode), buildProxyNode))
}
