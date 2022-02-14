/* eslint-disable react/require-default-props */
import React, { useCallback, useMemo } from 'react'
import { DocumentNode, gql, OperationVariables, TypedDocumentNode, useQuery } from '@apollo/client'
import { query } from 'gql-query-builder'
import { useGlobalStrategy } from '../../core/admin/useGlobalStrategy'
import { generateFields, useGqlBuilder, UseGQLBuilderParams } from '../../core/graphql/gql-builder'
import { GQLOperation } from '../../core/graphql/types'
import { NestedKeyOf } from '../../core/react/nested-key'
import { TreeRenderer } from '..'

type QueryProps<
  TQuery = Record<string, any>,
  TData = any,
  TVariables = OperationVariables
> = Partial<
  Omit<UseGQLBuilderParams<TQuery, TData, TVariables>, 'operation' | 'type' | 'additionaFields'>
> & {
  type?: 'list' | 'show'
  query: GQLOperation<TQuery, TData, TVariables>
  fields?: NestedKeyOf<Required<TData>>[]
}

const defaultResolver = (
  resource: string,
  operation: string,
  variables?: OperationVariables,
  fields?: string[]
): DocumentNode | TypedDocumentNode<any, OperationVariables> => {
  const result = query({
    operation,
    variables,
    fields: generateFields(fields),
  })

  return gql`
    ${result.query}
  `
}

export function Query<TQuery = Record<string, any>, TData = any, TVariables = OperationVariables>({
  query,
  type = 'show',
  fields = [],
  ...props
}: QueryProps<TQuery, TData, TVariables>) {
  const strategy = useGlobalStrategy()
  const generateGql = useCallback(
    (resource: string, operation: string, variables?: OperationVariables, fields?: string[]) => {
      return type === 'list'
        ? strategy?.list?.getQuery!(resource, operation, variables, fields) ||
            defaultResolver(resource, operation, variables, fields)
        : strategy?.show?.getQuery!(resource, operation, variables, fields) ||
            defaultResolver(resource, operation, variables, fields)
    },
    [strategy?.list?.getQuery, strategy?.show?.getQuery, type]
  )

  const { operation } = useGqlBuilder({
    type: 'query',
    generateGql,
    operation: query,
    additionalFields: fields,
    ...props,
  })

  const queryResult = useQuery(operation as any, {
    variables: props.variables,
  })

  const data = useMemo(
    () =>
      !queryResult.loading && queryResult.data
        ? type === 'list'
          ? strategy?.list.getList(queryResult)
          : strategy?.show.getItem(queryResult)
        : type === 'list'
        ? []
        : {},
    [queryResult, strategy?.list, strategy?.show, type]
  )

  const childrenProps = useMemo(() => {
    const propsOverride: Record<string, any> = {
      data,
      loading: queryResult.loading,
      error: queryResult.error,
      queryResult,
    }

    if (type === 'show') {
      propsOverride.record = data
    }

    return propsOverride
  }, [data, queryResult, type])

  // return <pre>{JSON.stringify(data, null, 2)}</pre>
  return <TreeRenderer children={props.children} propsOverride={childrenProps} />
}