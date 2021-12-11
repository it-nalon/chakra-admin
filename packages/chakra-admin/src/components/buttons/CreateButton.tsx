import { Button, ButtonProps } from '@chakra-ui/button'
import Icon from '@chakra-ui/icon'
import React, { FC, useMemo } from 'react'
import { Link, LinkProps } from 'react-router-dom'
import { BsPlus } from 'react-icons/bs'
import { ListProps } from '../../core/list/ListProps'
import { UseListReturn } from '../../core/list/useList'

type Props = Partial<ListProps> &
  Partial<UseListReturn> & { label?: string | boolean } & ButtonProps &
  Partial<LinkProps>

export const CreateButton: FC<Props> = ({
  basePath = '/',
  label: labelProp,
  resource,
  titleComponent,
  filtersComponent,
  toolbarComponent,
  listComponent,
  query,
  showMoreMenu,
  showMoreMenuEdit,
  showMoreMenuDelete,
  hasDelete,
  hasEdit,
  hasCreate,
  hasShow,
  deleteItemMutation,
  defaultSorting,
  currentFilters,
  currentSort,
  data,
  error,
  extensions,
  fetching,
  limit,
  offset,
  onFiltersChange,
  onPaginationChange,
  onSortChange,
  operation,
  pageCount,
  refetch,
  stale,
  total,

  to: toProp,
  ...rest
}) => {
  const to = useMemo(() => toProp || `${basePath}${resource}/create`, [basePath, resource, toProp])
  const label = useMemo(
    () =>
      typeof labelProp === 'boolean' && !labelProp ? undefined : labelProp || `Create ${resource}`,
    [labelProp, resource]
  )

  return (
    <Button as={Link} to={to} colorScheme="red" rightIcon={<Icon as={BsPlus} />} {...rest}>
      {label}
    </Button>
  )
}
