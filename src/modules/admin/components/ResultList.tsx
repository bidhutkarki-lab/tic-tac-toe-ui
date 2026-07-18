import { Badge, Table } from "@chakra-ui/react";
import type { GameResult } from "../types";

type ResultListProps = {
  results: GameResult[];
};

function formatDate(value: string): string {
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? value : d.toLocaleString();
}

function outcomeColor(outcome: string): string {
  switch (outcome.toUpperCase()) {
    case "WIN":
      return "green";
    case "LOSS":
      return "red";
    case "DRAW":
      return "gray";
    default:
      return "blue";
  }
}

export function ResultList({ results }: ResultListProps) {
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
            <Table.ColumnHeader>Game</Table.ColumnHeader>
            <Table.ColumnHeader>Player</Table.ColumnHeader>
            <Table.ColumnHeader>Outcome</Table.ColumnHeader>
            <Table.ColumnHeader>Points</Table.ColumnHeader>
            <Table.ColumnHeader>Created</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {results.map((result) => (
            <Table.Row key={result.id}>
              <Table.Cell
                fontVariantNumeric="tabular-nums"
                fontWeight="semibold"
                whiteSpace="nowrap"
              >
                {result.id}
              </Table.Cell>
              <Table.Cell
                fontVariantNumeric="tabular-nums"
                whiteSpace="nowrap"
              >
                #{result.gameId}
              </Table.Cell>
              <Table.Cell
                title={result.playerId}
                fontVariantNumeric="tabular-nums"
                color="blue.400"
                cursor="default"
                whiteSpace="nowrap"
              >
                {result.playerId.slice(0, 8)}…
              </Table.Cell>
              <Table.Cell whiteSpace="nowrap">
                <Badge colorPalette={outcomeColor(result.outcome)}>
                  {result.outcome}
                </Badge>
              </Table.Cell>
              <Table.Cell
                fontVariantNumeric="tabular-nums"
                whiteSpace="nowrap"
              >
                {result.points}
              </Table.Cell>
              <Table.Cell color="fg.muted" fontSize="sm" whiteSpace="nowrap">
                {formatDate(result.createdAt)}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Table.ScrollArea>
  );
}
