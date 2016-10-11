const mobx = require('mobx')
const nod = require('../')(mobx.autorun, mobx.untracked)

const state = mobx.observable([
  {text: 'one', style: ''},
  {text: 'two'},
  {text: 'six'}
])

const comp = (data) =>
  nod`<div style='${data.style}'>${data.text}</div>`

const test = nod`
  <div>
    <button onclick=${() => console.log('heyehy')}>click me</button>
    nod
    <div>
      <Test blah=${state[0]}></Test>
      <div>
        ${() => nod`
          <div>
            ${state.map(x => nod`
              <span id=${x.text}>${() => comp(x)}</span>
            `)}
          </div>
        `}
      </div>
      hi
    </div>
  </div>
`

const style = nod`
  <style>
    div {
      padding: 5px;
      border: 1px solid grey;
    }
  </style>
`
document.body.appendChild(style)
document.body.appendChild(test)

window.state = state
window.mobx = mobx
