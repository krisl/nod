const mobx = require('mobx')
const nod = require('../')(mobx.autorun)

const todos = mobx.observable([
  {text: 'make a todo list', done: false},
  {text: 'make a martini', done: true},
  {text: 'have a siesta', done: true},
  {text: 'call mom', done: false},
  {text: 'watch tv', done: true}
])

function add (e) {
  e.preventDefault()
  todos.push({text: this.todo.value, done: false})
}

function remove (i) {
  todos.splice(i, 1)
}

const todoApp = nod`
  <div>
    <h3>TODO</h3>
    ${() => nod`
      <ul>
        ${todos.map((todo, i) => nod`
          <li>
            ${todo.text}
            <button onclick=${() => remove(i)}>X</button>
          </li>
        `)}
      </ul>
    `}
    <form onsubmit=${add}>
      <input name='todo'/>
      <button>Add</button>
    </form>
  </div>
`

document.body.appendChild(todoApp)

window.todos = todos
window.mobx = mobx
