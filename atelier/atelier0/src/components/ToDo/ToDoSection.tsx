import { useReducer } from "react";
import ToDoList from "./ToDoList";
import itemsReducer from "./reducers/itemsReducer";
import ToDoForm from "./ToDoForm";

const ToDoSection = () => {
  const [items, dispatchItemsAction] = useReducer(itemsReducer, []);

  const addItem = (label: string) => {
    dispatchItemsAction({ type: "ADD_TODO", label });
  };

  const removeItem = (id: string) => {
    dispatchItemsAction({ type: "REMOVE_TODO", id });
  };

  const toggleItem = (id: string) => {
    dispatchItemsAction({ type: "TOGGLE_TODO", id });
  };

  return (
    <div className="p-4 h-full dark:bg-stone-700">
      <h2 className="text-md font-bold mb-4 dark:text-white">To Do List</h2>
      <ToDoForm onAddItem={addItem} />
      <ToDoList items={items} onRemove={removeItem} onToggle={toggleItem} />
    </div>
  );
};

export default ToDoSection;
