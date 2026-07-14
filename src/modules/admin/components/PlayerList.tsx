import { Table } from "@chakra-ui/react";
import type { Player } from "../../players/types";

type PlayerListProps = {
  players: Player[];
};

function formatDate(value: string): string {
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? value : d.toLocaleString();
}

export function PlayerList({ players }: PlayerListProps) {
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
            <Table.ColumnHeader>Username</Table.ColumnHeader>
            <Table.ColumnHeader>Created</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {players.map((player) => (
            <Table.Row key={player.id}>
              <Table.Cell
                title={player.id}
                fontVariantNumeric="tabular-nums"
                fontWeight="semibold"
                color="blue.400"
                cursor="default"
                whiteSpace="nowrap"
              >
                {player.id.slice(0, 8)}…
              </Table.Cell>
              <Table.Cell whiteSpace="nowrap">@{player.username}</Table.Cell>
              <Table.Cell color="fg.muted" fontSize="sm" whiteSpace="nowrap">
                {formatDate(player.createdAt)}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Table.ScrollArea>
  );
}
