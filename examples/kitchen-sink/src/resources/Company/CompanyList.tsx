/* eslint-disable react/jsx-key */
import React, { FC } from 'react'
import {
  DataTable,
  Filters,
  Input,
  List,
  OffsetSortDirection,
  DataTableValue as Field,
  ListToolbar,
  CreateButton,
} from 'chakra-admin'
import { gql } from '@apollo/client'

const QUERY_GET_COMPANIES = gql`
  query GetCompanies($pagination: PaginationInput, $sort: CompanySortInput, $filters: CompanyFilterInput) {
    companies(pagination: $pagination, sort: $sort, filters: $filters) {
      total
      data {
        id
        name
      }
    }
  }
`

const MUTATION_DELETE_COMPANY = gql`
  mutation DeleteCompany($id: ID!) {
    deleteCompany(id: $id)
  }
`

const CompanyFilters: FC = (props) => (
  <Filters {...props}>
    <Input source="name" label="name" alwaysOn />
  </Filters>
)

export const CompanyList: FC = (props) => {
  return (
    <List
      {...props}
      query={QUERY_GET_COMPANIES}
      defaultPerPage={20}
      deleteItemMutation={MUTATION_DELETE_COMPANY}
      filtersComponent={<CompanyFilters />}
      defaultSorting={{ name: OffsetSortDirection.ASC }}
      toolbarComponent={
        <ListToolbar>
          <CreateButton openAsModal />
        </ListToolbar>
      }
    >
      <DataTable>
        <Field source="id" label="ID" />
        <Field source="name" label="Name" />
      </DataTable>
    </List>
  )
}
