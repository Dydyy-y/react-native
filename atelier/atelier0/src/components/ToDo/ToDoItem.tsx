import type { Todo } from "../../types/todo.type";

export interface TodoItemProps {
  item: Todo;
  onRemove: (id: string) => void;
  onToggle: (id: string) => void;
}

const ToDoItem = ({
  item: { id, label, done },
  onRemove,
  onToggle,
}: TodoItemProps) => {
  return (
    <li className="flex items-center gap-2 dark:text-white">
      <input type="checkbox" checked={done} onChange={() => onToggle(id)} />
      <div>
        <span className="text-xs text-gray-500">#{id}</span>
        <p>{label}</p>
      </div>
      <button
        className="ml-auto text-red-500 hover:text-red-700 dark:hover:text-red-400"
        onClick={() => onRemove(id)}
      >
        ❌
      </button>
    </li>
  );
};

export default ToDoItem;
