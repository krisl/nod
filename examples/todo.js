const mobx = require('mobx')
const nod = require('../')(mobx.autorun, mobx.untracked)

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

function onchange (e) {
  todos[e.target.dataset.idx].done = e.target.checked
}

const todoItem = (todo, i) => {
  console.log('i', i)
return nod`
  <li id=${i}>
    <label>
      ${console.log('todo', i)}
      <input type='checkbox' data-idx=${i} checked=${todo.done} onchange=${onchange} />
      ${todo.text}
      <button onclick=${() => remove(i)}>X</button>
    </label>
  </li>
`
}

const todoApp = nod`
  <div>
    <h3>TODO</h3>
    ${() => console.log('map running') || nod`
      <ul>
        ${todos.map(nod.sup(todoItem))}
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
