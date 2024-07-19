import { SubmitHandler, useForm } from 'react-hook-form'
import {
  useCraeteTodo,
  useDeleteTodos,
  useUpdateTodos,
} from '../services/mutations'
import { useTodos, useTodosIds } from '../services/queries'
import { Todo } from '../types/todo'

const Todos = () => {
  const todosIdsQuery = useTodosIds()

  const todoQueries = useTodos(todosIdsQuery.data)

  const createTodoMutation = useCraeteTodo()

  const updateTodoMutation = useUpdateTodos()

  const deleteTodoMutation = useDeleteTodos()

  const { register, handleSubmit } = useForm<Todo>()

  const handleCreateTodoSubmit: SubmitHandler<Todo> = (data) => {
    createTodoMutation.mutate(data)
  }

  const handleMarkasDoneSubmit = (data: Todo | undefined) => {
    if (data) {
      updateTodoMutation.mutate({ ...data, checked: true })
    }
  }

  const handleDeleteTodo = async (id: number) => {
    await deleteTodoMutation.mutateAsync(id)
    console.log('successful')
  }

  return (
    <div>
      <form onSubmit={handleSubmit(handleCreateTodoSubmit)}>
        <h4>New todo:</h4>
        <input placeholder="Title" {...register('title')} />
        <br />
        <input placeholder="Description" {...register('description')} />
        <br />
        <input
          type="submit"
          disabled={createTodoMutation.isPending}
          value={createTodoMutation.isPending ? 'Creating...' : 'Create todo'}
        />
      </form>

      <ul>
        {todoQueries.map(({ data }) => (
          <li key={data?.id}>
            <div>Id: {data?.id}</div>
            <span>
              <strong> Title :</strong> {data?.title}
              <strong> Description :</strong> {data?.description}
            </span>
            <div>
              <button
                disabled={data?.checked}
                onClick={() => handleMarkasDoneSubmit(data)}
              >
                {data?.checked ? 'Done' : 'Mark as Done'}
              </button>
              {data && data?.id && (
                <button onClick={() => handleDeleteTodo(data.id!)}>
                  Delete
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Todos
