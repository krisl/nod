const mobx = require('mobx')
const nod = require('../')(mobx.autorun)

const state = mobx.observable([
  "first todo",
  "second todo"
])

function add (e) {
  e.preventDefault()
  state.push(this.todo.value)
}

const todos = nod`
  <div>
    <h3>TODO</h3>
    ${() => nod`
      <ul>
        ${state.map((todo) => nod`<li>${todo}</li>`)}
      </ul>
    `}
    <form onsubmit=${add}>
      <input name='todo'/>
      <button>Add</button>
    </form>
  </div>
`

document.body.appendChild(todos)

window.state = state
window.mobx = mobx
