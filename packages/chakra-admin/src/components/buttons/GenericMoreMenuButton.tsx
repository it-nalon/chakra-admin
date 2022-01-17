import { OperationVariables, TypedDocumentNode, useApolloClient } from '@apollo/client'
import {
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
  Icon,
  IconButton,
} from '@chakra-ui/react'
import { useTranslate } from 'ca-i18n'
import { DocumentNode } from 'graphql'
import React, { FC, useCallback, useState } from 'react'
import { BsFillEyeFill } from 'react-icons/bs'
import { FaEdit, FaTrash } from 'react-icons/fa'
import { FiMoreVertical } from 'react-icons/fi'
import { Link, useLocation } from 'react-router-dom'
import { RouteAvailability } from '../../core/admin/RouteAvailability'
import { useGetResourceLabel } from '../../core/admin/useGetResourceLabel'
import { useGlobalStrategy } from '../../core/admin/useGlobalStrategy'

export type GenericMoreMenuButtonProps<Data = any, Variables = OperationVariables> = {
  deleteItemMutation?: DocumentNode | TypedDocumentNode<Data, Variables>
  onDelete?: (id: string) => void
  onDeleteCompleted?: () => void
  id?: string
  confirmDialogTitle?: string
  confirmDialogBody?: string
  showConfirmDialogOnDelete?: boolean
  confirmDialogCancelButtonLabel?: string
  confirmDialogConfirmDeleteButtonLabel?: string
  resource?: string
  openShowAsModal?: boolean
  openEditAsModal?: boolean
  hideDelete?: boolean
  hideEdit?: boolean
  hideShow?: boolean
} & RouteAvailability

export const GenericMoreMenuButton: FC<GenericMoreMenuButtonProps> = ({
  deleteItemMutation,
  onDelete,
  onDeleteCompleted,
  confirmDialogBody = 'Sei sicuro di voler eliminare questo elemento?',
  confirmDialogTitle = 'Elimina Risorsa',
  confirmDialogCancelButtonLabel = 'Annulla',
  confirmDialogConfirmDeleteButtonLabel = 'Elimina risorsa',
  showConfirmDialogOnDelete = true,
  id,
  resource,
  hasEdit,
  hasShow,
  openShowAsModal,
  openEditAsModal,
  hideShow,
  hideEdit,
  hideDelete,
}) => {
  const { isOpen, onClose, onOpen } = useDisclosure()
  const t = useTranslate()
  const getResourceLabel = useGetResourceLabel()
  const location = useLocation()
  const client = useApolloClient()
  const notify = useToast()
  const [fetching, setFetching] = useState<boolean>(false)
  const strategy = useGlobalStrategy()

  const handleDeleteItem = useCallback(async () => {
    if (onDelete) {
      onDelete(id!)
    } else {
      try {
        const variables = strategy?.delete.getVariables(id!)
        if (!variables) {
          throw new Error('Variables not found in DeleteStrategy.getVariables()')
        }

        setFetching(true)
        const result = await client.mutate({
          mutation: deleteItemMutation!,
          variables,
        })
        if (result.errors && result.errors.length > 0) {
          throw new Error(`Error deleting resource with id:${id}`)
        } else {
          notify({
            status: 'success',
            title: 'Risorsa eliminata correttamente',
            isClosable: true,
          })
          onClose()
          if (onDeleteCompleted) {
            onDeleteCompleted()
          }
        }
      } catch (error) {
        console.error('Error during delete', error)
        notify({
          status: 'error',
          position: 'top',
          isClosable: true,
          title: 'Errore!',
          // eslint-disable-next-line @typescript-eslint/quotes
          description: "C'è stato un problema con l'eliminazione della risorsa, riprova più tardi.",
        })
      } finally {
        setFetching(false)
      }
    }
  }, [
    client,
    deleteItemMutation,
    id,
    notify,
    onClose,
    onDelete,
    onDeleteCompleted,
    strategy?.delete,
  ])

  const handleMenuItemDeleteClick = useCallback(() => {
    if (showConfirmDialogOnDelete) {
      onOpen()
    } else {
      handleDeleteItem()
    }
  }, [handleDeleteItem, onOpen, showConfirmDialogOnDelete])

  return (
    <>
      <Menu isLazy>
        <MenuButton
          as={IconButton}
          variant="ghost"
          aria-label="Più opzioni"
          ml={3}
          color="blackAlpha.700"
          icon={<Icon as={FiMoreVertical} />}
        />
        <MenuList border="0px">
          {hasShow && !hideShow && (
            <MenuItem
              as={Link}
              to={`/${resource}/${id}/show`}
              state={openShowAsModal ? { background: location } : undefined}
              icon={<Icon as={BsFillEyeFill} />}
            >
              {t('ca.action.show')}
            </MenuItem>
          )}
          {hasEdit && !hideEdit && (
            <MenuItem
              as={Link}
              to={`/${resource}/${id}`}
              state={openEditAsModal ? { background: location } : undefined}
              icon={<Icon as={FaEdit} />}
            >
              {t('ca.action.edit')}
            </MenuItem>
          )}
          {deleteItemMutation && !hideDelete && (
            <MenuItem
              onClick={handleMenuItemDeleteClick}
              color="red.500"
              icon={<Icon color="red.400" as={FaTrash} />}
            >
              {t('ca.action.delete')}
            </MenuItem>
          )}
        </MenuList>
      </Menu>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {t('ca.message.delete_title', {
              name: resource ? getResourceLabel(resource, 1) : undefined,
              id,
            })}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {t('ca.message.delete_content', {
              name: resource ? getResourceLabel(resource, 1) : undefined,
              id,
            })}
          </ModalBody>

          <ModalFooter>
            <Button disabled={fetching} mr={3} onClick={onClose}>
              {t('ca.action.cancel')}
            </Button>
            <Button
              onClick={handleDeleteItem}
              isLoading={fetching}
              disabled={fetching}
              colorScheme="red"
            >
              {t('ca.action.confirm_delete', {
                name: resource ? getResourceLabel(resource, 1) : undefined,
                id,
              })}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )

  // return (
  //   <IconButton
  //     variant="ghost"
  //     minW="20px"
  //     w="20px"
  //     colorScheme="red"
  //     aria-label="Più opzioni"
  //     color="blackAlpha.700"
  //     icon={<Icon as={FiMoreVertical} />}
  //   />
  // )
}
