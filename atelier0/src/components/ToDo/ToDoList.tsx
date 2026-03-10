import type { Todo } from "../../types/todo.type";
import ToDoItem from "./ToDoItem";

export interface ToDoListProps {
  items: Todo[];
  onRemove: (id: string) => void;
  onToggle: (id: string) => void;
}

const ToDoList = ({ items, onRemove, onToggle }: ToDoListProps) => {
  if (items.length === 0) {
    return (
      <div className="text-sm text-gray-500 dark:text-gray-200">
        No tasks yet. Add a task to get started!
      </div>
    );
  }

  return (
    <ul className="my-4">
      {items.map((item) => (
        <ToDoItem item={item} onRemove={onRemove} onToggle={onToggle} />
      ))}
    </ul>
  );
};

export default ToDoList;
