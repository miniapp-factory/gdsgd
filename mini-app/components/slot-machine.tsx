"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Share } from "@/components/share";
import { url } from "@/lib/metadata";

const fruits = ["apple", "banana", "cherry", "lemon"];
const fruitImages: Record<string, string> = {
  apple: "/fruit-apple.png",
  banana: "/fruit-banana.png",
  cherry: "/fruit-cherry.png",
  lemon: "/fruit-lemon.png",
};

function randomFruit() {
  return fruits[Math.floor(Math.random() * fruits.length)];
}

export default function SlotMachine() {
  const [grid, setGrid] = useState<string[][]>(
    Array.from({ length: 3 }, () => Array.from({ length: 3 }, randomFruit))
  );
  const [spinning, setSpinning] = useState(false);
  const [winMessage, setWinMessage] = useState<string | null>(null);

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    setWinMessage(null);
    const interval = setInterval(() => {
      setGrid((prev) => {
        const newGrid = prev.map((row) => [...row]);
        // shift rows down
        for (let col = 0; col < 3; col++) {
          for (let row = 2; row > 0; row--) {
            newGrid[row][col] = newGrid[row - 1][col];
          }
          newGrid[0][col] = randomFruit();
        }
        return newGrid;
      });
    }, 200);
    setTimeout(() => {
      clearInterval(interval);
      setSpinning(false);
      checkWin();
    }, 2000);
  };

  const checkWin = () => {
    // check rows
    for (let r = 0; r < 3; r++) {
      if (grid[r][0] === grid[r][1] && grid[r][1] === grid[r][2]) {
        setWinMessage(`You won a ${grid[r][0]} row!`);
        return;
      }
    }
    // check columns
    for (let c = 0; c < 3; c++) {
      if (grid[0][c] === grid[1][c] && grid[1][c] === grid[2][c]) {
        setWinMessage(`You won a ${grid[0][c]} column!`);
        return;
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="grid grid-cols-3 gap-2">
        {grid.flatMap((row, rowIndex) =>
          row.map((fruit, colIndex) => (
            <img
              key={`${rowIndex}-${colIndex}`}
              src={fruitImages[fruit]}
              alt={fruit}
              className="w-16 h-16"
            />
          ))
        )}
      </div>
      <Button onClick={spin} disabled={spinning}>
        {spinning ? "Spinning..." : "Spin"}
      </Button>
      {winMessage && (
        <div className="flex flex-col items-center gap-2">
          <span className="text-lg font-semibold">{winMessage}</span>
          <Share text={`I ${winMessage} at ${url}`} />
        </div>
      )}
    </div>
  );
}
