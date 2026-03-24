import { useState } from "react";

export interface ToDoFormProps {
  onAddItem: (label: string) => void;
}

const ToDoForm = ({ onAddItem }: ToDoFormProps) => {
  const [label, setLabel] = useState("");

  const handleAddItem = () => {
    if (label.length === 0) return;
    onAddItem(label);
    setLabel("");
  };

  return (
    <div>
      <input
        className="border border-gray-300 rounded-md p-2 mr-2 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
        type="text"
        placeholder="Add a new task"
        onChange={(e) => setLabel(e.target.value)}
        value={label}
      />
      <button
        className="bg-gray-500 text-white rounded-md p-2 dark:bg-gray-700 disabled:opacity-20"
        type="submit"
        onClick={handleAddItem}
        disabled={label.length === 0}
      >
        Add +
      </button>
    </div>
  );
};

export default ToDoForm;
