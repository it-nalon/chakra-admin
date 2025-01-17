import React, { FC, useCallback } from 'react'
import { chakra, ChakraProps, Box } from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { UseCreateResult } from '../../core/details/useCreate'
import { UseEditResult } from '../../core/details/useEdit'
import { CancelButton } from '../buttons/CancelButton'
import { SubmitButton } from '../buttons/SubmitButton'
import { filterChakraProps } from 'ca-system'
import { TreeRenderer } from '../details/TreeRenderer'

type BaseFormProps = {
  children?: React.ReactNode
  defaultValues?: any
  resource?: string
  renderingInModal?: boolean
} & Partial<UseCreateResult | UseEditResult> &
  ChakraProps

export const BaseForm: FC<BaseFormProps> = ({
  children,
  defaultValues,
  onSubmit: onSubmitProp = () => {},
  mutationResult,
  executeMutation,
  resource,
  renderingInModal,
  ...rest
}) => {
  const methods = useForm({ defaultValues })
  const { handleSubmit } = methods

  const onSubmit = useCallback(
    (values) => {
      // const foundedFields = deepFilter(children, (child: any) => {
      //   if (child.props.source) {
      //     return true
      //   }

      //   return false
      // })
      //   ?.map((item) => item && (item as any)?.props && (item as any).props.source)
      //   ?.filter((item) => !!item)
      // console.log('values', foundedFields, values)
      // const finalData = foundedFields?.reduce((acc, item) => {
      //   return {
      //     ...acc,
      //     [item]: values[item],
      //   }
      // }, {})
      onSubmitProp({ __typename: resource, ...values })
    },
    [onSubmitProp, resource]
  )

  return (
    <chakra.form onSubmit={handleSubmit(onSubmit)}>
      <chakra.div mb={renderingInModal ? '76px' : 0}>
        {/* {deepMap(children, (child: any, index) => {
          const isLayout =
            child?.type?.displayName &&
            Object.keys(CALayoutComponents).includes(child?.type?.displayName)

          if (isLayout) {
            return React.createElement(
              ca[child.type.displayName],
              {
                ...{
                  ...child.props,
                  // onSubmit,
                  executeMutation,
                  mutationResult,
                  register: methods.register,
                  unregister: methods.unregister,
                  setValue: methods.setValue,
                  control: methods.control,
                  ...filterChakraProps(rest),
                  resource,
                  key: `${child?.type?.displayName || 'FI'}-${index}`,
                },
              },
              child.props?.children
            )
          } else {
            const { ...restProps } = child.props
            return React.createElement(child.type, {
              ...{
                ...restProps,
                ...filterChakraProps(rest),
                setValue: methods.setValue,
                register: methods.register,
                unregister: methods.unregister,
                control: methods.control,
                name: child.props.source,
                resource,
                key: `${child?.type?.displayName || 'FI'}-${child.props.source}-${index}`,
              },
            })
            // return child.props.source
            //   ? React.createElement(child.type, {
            //       ...{
            //         ...restProps,
            //         register: methods.register,
            //         control: methods.control,
            //         name: child.props.source,
            //         key: child.props.source,
            //       },
            //     })
            //   : child
          }
        })} */}
        <TreeRenderer
          children={children}
          propsOverride={{
            ...filterChakraProps(rest),
            setValue: methods.setValue,
            register: methods.register,
            unregister: methods.unregister,
            control: methods.control,
            resource,
          }}
        />
      </chakra.div>

      <Box
        zIndex="1"
        position={renderingInModal ? 'fixed' : 'relative'}
        bottom="0px"
        w="100%"
        right="0px"
        boxShadow={renderingInModal ? 'main' : 'none'}
        bg={renderingInModal ? 'white' : 'transparent'}
        p={renderingInModal ? 4 : 0}
      >
        <chakra.div display="flex" justifyContent="end" marginBottom={renderingInModal ? 0 : 5}>
          <CancelButton />
          <SubmitButton
            disabled={mutationResult?.loading}
            isLoading={mutationResult?.loading}
            type="submit"
            bg="gray.700"
            _hover={{ bg: 'gray.500' }}
            ml={5}
          />
        </chakra.div>
      </Box>
    </chakra.form>
  )
}
