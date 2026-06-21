import { useState, useEffect } from "react";
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, closestCorners } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import api from "../api/client";
import { Column as ColumnType, Card as CardType, Board as BoardType } from "../types";
import { Column } from "./Column";
import { Card } from "./Card";
import { useAuth } from "../hooks/useAuth";

export function Board() {
  const [board, setBoard] = useState<BoardType | null>(null);
  const [boards, setBoards] = useState<BoardType[]>([]);
  const [activeCard, setActiveCard] = useState<CardType | null>(null);
  const { logout } = useAuth();

  useEffect(() => {
    api.get("/boards").then((res) => {
      setBoards(res.data);
      if (res.data.length > 0) setBoard(res.data[0]);
    });
  }, []);

  async function handleDragEnd(event: DragEndEvent) {
    setActiveCard(null);
    const { active, over } = event;
    if (!over || !board) return;

    const cardId = active.id as string;
    const overId = over.id as string;

    let targetColumn = board.columns.find((c) => c.id === overId);
    let targetPosition = 0;

    if (!targetColumn) {
      targetColumn = board.columns.find((c) => c.cards.some((card) => card.id === overId));
      if (!targetColumn) return;
      const overIndex = targetColumn.cards.findIndex((c) => c.id === overId);
      targetPosition = overIndex >= 0 ? overIndex : targetColumn.cards.length;
    } else {
      targetPosition = targetColumn.cards.length;
    }

    await api.patch(`/cards/${cardId}/move`, {
      columnId: targetColumn.id,
      position: targetPosition,
    });

    const updated = await api.get("/boards");
    setBoards(updated.data);
    const current = updated.data.find((b: BoardType) => b.id === board.id);
    if (current) setBoard(current);
  }

  async function addCard(columnId: string) {
    const title = prompt("Card title:");
    if (!title) return;
    await api.post("/cards", { title, columnId });
    const { data } = await api.get("/boards");
    setBoards(data);
    setBoard(data.find((b: BoardType) => b.id === board.id));
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm border-b px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-gray-800">Kanban</h1>
          <select
            className="border rounded-lg px-3 py-2 text-sm"
            value={board?.id || ""}
            onChange={(e) => {
              const b = boards.find((b) => b.id === e.target.value);
              if (b) setBoard(b);
            }}
          >
            {boards.map((b) => (
              <option key={b.id} value={b.id}>{b.title}</option>
            ))}
          </select>
          <button
            onClick={async () => {
              const title = prompt("Board name:");
              if (!title) return;
              const { data } = await api.post("/boards", { title });
              setBoards([...boards, data]);
              setBoard(data);
            }}
            className="text-sm bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            + New Board
          </button>
        </div>
        <button onClick={logout} className="text-sm text-gray-500 hover:text-red-600">Logout</button>
      </header>

      <div className="p-6">
        {board && (
          <DndContext
            collisionDetection={closestCorners}
            onDragStart={(event: DragStartEvent) => {
              for (const col of board.columns) {
                const card = col.cards.find((c) => c.id === event.active.id);
                if (card) { setActiveCard(card); break; }
              }
            }}
            onDragEnd={handleDragEnd}
          >
            <div className="flex gap-6 overflow-x-auto pb-4">
              {board.columns.map((col) => (
                <Column key={col.id} column={col} onAddCard={() => addCard(col.id)} />
              ))}
            </div>
            <DragOverlay>
              {activeCard && <Card card={activeCard} isOverlay />}
            </DragOverlay>
          </DndContext>
        )}
      </div>
    </div>
  );
}
