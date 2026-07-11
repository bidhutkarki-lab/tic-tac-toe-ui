import { Table } from "@chakra-ui/react";
import type { AdminUser } from "../types";

type UserListProps = {
  users: AdminUser[];
};

function formatDate(value: string): string {
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? value : d.toLocaleString();
}

export function UserList({ users }: UserListProps) {
  return (
    <Table.ScrollArea
      w="full"
      maxW="60rem"
      borderWidth="1px"
      rounded="2xl"
      shadow="2xl"
    >
      <Table.Root size="md" stickyHeader interactive>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>ID</Table.ColumnHeader>
            <Table.ColumnHeader>Name</Table.ColumnHeader>
            <Table.ColumnHeader>Username</Table.ColumnHeader>
            <Table.ColumnHeader>Auth ID</Table.ColumnHeader>
            <Table.ColumnHeader>Created</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {users.map((user) => (
            <Table.Row key={user.id}>
              <Table.Cell
                title={user.id}
                fontVariantNumeric="tabular-nums"
                fontWeight="semibold"
                color="blue.400"
                cursor="default"
                whiteSpace="nowrap"
              >
                {user.id.slice(0, 8)}…
              </Table.Cell>
              <Table.Cell whiteSpace="nowrap">
                {user.firstName} {user.lastName}
              </Table.Cell>
              <Table.Cell whiteSpace="nowrap">@{user.username}</Table.Cell>
              <Table.Cell
                fontVariantNumeric="tabular-nums"
                color="fg.muted"
                whiteSpace="nowrap"
              >
                {user.authId}
              </Table.Cell>
              <Table.Cell
                color="fg.muted"
                fontSize="sm"
                whiteSpace="nowrap"
              >
                {formatDate(user.createdAt)}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Table.ScrollArea>
  );
}
