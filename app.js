const express = require('express')
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const path = require('path')

const databasePath = path.join(__dirname, 'todoApplication.db')

const app = express()
app.use(express.json())

let database = null

const intilalizationDb = async () => {
  try {
    database = await open({
      filename: databasePath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('Server Running at http://localhost/3000')
    })
  } catch (error) {
    console.log(`DB Error : ${error.message}`)
    processs.exit(1)
  }
}

intilalizationDb()

const hasPriorityAndStatusProperties = requestQuery => {
  return (
    requestQuery.priority !== undefined && requestQuery.status !== undefined
  )
}

const hasPriorityProperty = requestQuery => {
  return requestQuery.priority !== undefined
}

const hasStatusProperty = requestQuery => {
  return requestQuery.status !== undefined
}

//APl 1

app.get('/todos/', async (request, response) => {
  let data = null
  let getTodosQuery = null
  const {search_q = '', priority, status} = request.query

  switch (trye) {
    case hasPriorityAndStatusProperties(request, query):
      getTodosQuery = `
            select * from todo
            where
            todo like '%${search_q}%'
            and status = '${status}'
            and priority = '${priority}';`
      break
    case hasPriorityProperty(request.query):
      getTodosQuery = `
            select * from todo
            where
            todo like '%${search_q}%'
            and priority = '${priority}';`
      break
    case hasStatusProperty(request.query):
      getTodosQuery = `
            select * from todo
            where
            todo like '%${search_q}%'
            and status = '${status}';`
      break
    default:
      getTodosQuery = `
            select * from todo
            where
            todo like '%${search_q}&';`
  }
  data = await database.all(getTodosQuery)
  response.send(data)
})

//APL 2

app.get('/todos/:todosId/', async (request, response) => {
  const {todoId} = request.params
  const getTodoQuery = `
    select * from todo
    where id = ${todoId};`;
    const todo = await database.get(getTodoQuery);
    response.send(todo)
})

// APL 3

app.post("/todos/", async (request,response) =>{
    const { id, todo, priority, status} = request.body;
    const postTodoQuery = `
    insert into 
    todo (id, todo, priority, status)
    values
    (${id}, '${todo}', '${priority}', '${status}');`;
    await database.run(postTodoQuery);
    response.send("Todo Successfully Added");
})

//Apl 4

app.put("/todos/:todoId/", async (request,response) =>{
    const { todoId } =request.params;
    let updateColumn = "";
    const requestBody = request.body;
    switch (true) {
        case requestBody.status !== undefined:
        updateColumn = "Status";
        break
        case requestBody.priority !== undefined:
        updateColumn = "Priority";
        break
        case requestBody.todo !== undefined:
        updateColumn = "Todo";
        break
    }
    const previousTodoQuery = `
    select * from todo
    where id = ${todoId};`;
    const previousTodo = await database.get(previousTodoQuery);

    const {
        todo = previousTodo.todo,
        priority = previousTodo.priority,
        status = previousTodo.status,
    } = request.body;

    const updateTodoQuery =`
    update todo
    set 
    todo = '${todo}',
    priority = '${priority}',
    status = '${status}'
    where
    id = ${todoId};`;

    await database.run(updateTodoQuery);
    response.send(`${updateColumn} updated`)
})

// Apl 5

app.delete("/todos/:todoId/", async (request,response) =>{
    const { todoId } = request.params;
    const deleteQuery = `
    delete from
    todo
    where
    id = ${todoId};`;
    await database.run(deleteQuery);
    response.send("Todo Deleted");
})

module.exports = app