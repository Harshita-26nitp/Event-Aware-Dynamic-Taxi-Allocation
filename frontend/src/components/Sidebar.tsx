import React, { useState } from "react";

type Props = {
  onRun: (text: string) => void;
};

export default function Sidebar({ onRun }: Props) {
  const [text, setText] = useState<string>("");

  return (
    <div className="bg-gray-900 p-4 w-64">
      <h2 className="text-white mb-2">Event Input</h2>

      <input
        className="p-2 w-full text-black"
        value={text}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setText(e.target.value)
        }
        placeholder="Enter event..."
      />

      <button
        onClick={() => onRun(text)}
        className="mt-2 bg-blue-500 p-2 w-full"
      >
        Run
      </button>
    </div>
  );
}