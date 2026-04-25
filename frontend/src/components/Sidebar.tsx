import React, { useState } from "react";

type Props = {
  onRun: (text: string) => void;
};

export default function Sidebar({ onRun }: Props) {
  const [text, setText] = useState("");

  const handleClick = () => {
    console.log("Button clicked:", text);
    onRun(text);
  };

  return (
    <div className="bg-gray-900 p-4 w-64 min-h-screen">
      
      <h2 className="text-white text-lg font-bold mb-4">
        Event Input
      </h2>

      <input
        className="p-2 w-full text-black rounded"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter event..."
      />

      <button
        onClick={handleClick}
        className="mt-3 bg-blue-500 hover:bg-blue-600 p-2 w-full rounded text-white"
      >
        Run
      </button>

    </div>
  );
}