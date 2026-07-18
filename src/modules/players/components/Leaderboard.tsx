import { Table } from "@chakra-ui/react";
import type { LeaderboardEntry } from "../types";

type LeaderboardProps = {
  entries: LeaderboardEntry[];
  currentPlayerId?: string;
};

export function Leaderboard({ entries, currentPlayerId }: LeaderboardProps) {
  return (
    <Table.ScrollArea
      w="full"
      maxW="40rem"
      borderWidth="1px"
      rounded="2xl"
      shadow="2xl"
    >
      <Table.Root size="md" stickyHeader interactive>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>#</Table.ColumnHeader>
            <Table.ColumnHeader>Player</Table.ColumnHeader>
            <Table.ColumnHeader textAlign="end">Rating</Table.ColumnHeader>
            <Table.ColumnHeader textAlign="end">W</Table.ColumnHeader>
            <Table.ColumnHeader textAlign="end">L</Table.ColumnHeader>
            <Table.ColumnHeader textAlign="end">D</Table.ColumnHeader>
            <Table.ColumnHeader textAlign="end">Played</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {entries.map((entry) => {
            const isCurrent = entry.playerId === currentPlayerId;
            return (
              <Table.Row
                key={entry.playerId}
                bg={isCurrent ? "blue.subtle" : undefined}
                fontWeight={isCurrent ? "semibold" : undefined}
              >
                <Table.Cell fontVariantNumeric="tabular-nums" whiteSpace="nowrap">
                  {entry.rank}
                </Table.Cell>
                <Table.Cell whiteSpace="nowrap">{entry.username}</Table.Cell>
                <Table.Cell
                  textAlign="end"
                  fontVariantNumeric="tabular-nums"
                  fontWeight="semibold"
                  whiteSpace="nowrap"
                >
                  {entry.rating}
                </Table.Cell>
                <Table.Cell
                  textAlign="end"
                  color="green.400"
                  fontVariantNumeric="tabular-nums"
                >
                  {entry.wins}
                </Table.Cell>
                <Table.Cell
                  textAlign="end"
                  color="red.400"
                  fontVariantNumeric="tabular-nums"
                >
                  {entry.losses}
                </Table.Cell>
                <Table.Cell
                  textAlign="end"
                  color="fg.muted"
                  fontVariantNumeric="tabular-nums"
                >
                  {entry.draws}
                </Table.Cell>
                <Table.Cell
                  textAlign="end"
                  fontVariantNumeric="tabular-nums"
                >
                  {entry.gamesPlayed}
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table.Root>
    </Table.ScrollArea>
  );
}
