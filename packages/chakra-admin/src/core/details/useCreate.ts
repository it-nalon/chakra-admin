import { useToast } from '@chakra-ui/toast'
import { useCallback } from 'react'
import { useHistory } from 'react-router'
import { OperationContext, OperationResult, useMutation, UseMutationState } from 'urql'
import { CreateProps } from '../../components/details/Create'

export type UseCreateResult = {
  executeMutation: (
    variables?: any,
    context?: Partial<OperationContext> | undefined
  ) => Promise<OperationResult<object, any>>
  mutationResult?: UseMutationState<object, any>
  onSubmit: (values: any) => Promise<UseMutationState<object, any>>
}

export const useCreate = ({ mutation, resource }: CreateProps): UseCreateResult => {
  const [mutationResult, executeMutation] = useMutation(mutation)
  const history = useHistory()
  const notify = useToast()

  const onSubmit = useCallback(
    async (values: any): Promise<any> => {
      try {
        const result = await executeMutation({ data: values })
        if (result.data && !result.error) {
          notify({
            status: 'success',
            title: `${resource} creato correttamente`,
            isClosable: true,
          })
          history.goBack()
        } else {
          throw new Error(result.error?.message)
        }
        return result
      } catch (error) {
        console.error('Error During Creation submit', error)
        notify({
          status: 'error',
          title: `Errore durante la creazione della risorsa ${resource}`,
          description: error && error.message ? error.message : undefined,
          isClosable: true,
        })
      }
    },
    [executeMutation, history, notify, resource]
  )

  return {
    executeMutation,
    mutationResult,
    onSubmit,
  }
}
