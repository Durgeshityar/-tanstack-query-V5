import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Todo } from '../types/todo'
import { createTodo, deleteTodo, updateTodo } from './api'

export function useCraeteTodo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Todo) => createTodo(data),
    onMutate: () => {
      console.log('mutated')
    },

    onError: () => {
      console.log('error')
    },

    onSuccess: () => {
      console.log('success')
    },

    onSettled: async (error) => {
      console.log('settled')
      if (error) {
        console.log(error)
      } else {
        await queryClient.invalidateQueries({ queryKey: ['todos'] })
      }
    },
  })
}

export function useUpdateTodos() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Todo) => updateTodo(data),
    onSettled: async (_, error, variables) => {
      if (error) {
        console.log(error)
      } else {
        await queryClient.invalidateQueries({ queryKey: ['todos'] })
        await queryClient.invalidateQueries({
          queryKey: ['todo', { id: variables.id }],
        })
      }
    },
  })
}

export function useDeleteTodos() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => deleteTodo(id),

    onSuccess: () => {
      console.log('deleted successfully')
    },

    onSettled: async (_, error) => {
      if (error) {
        console.log(error)
      } else {
        await queryClient.invalidateQueries({ queryKey: ['todos'] })
      }
    },
  })
}
