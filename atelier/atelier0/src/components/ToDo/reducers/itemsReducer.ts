import type { Todo } from "../../../types/todo.type";

export interface TodoAddAction {
  type: "ADD_TODO";
  label: string;
}

export interface TodoRemoveAction {
  type: "REMOVE_TODO";
  id: string;
}

export interface TodoToggleAction {
  type: "TOGGLE_TODO";
  id: string;
}

export type ToDoAction = TodoAddAction | TodoRemoveAction | TodoToggleAction;

const itemsReducer = (state: Todo[], action: ToDoAction) => {
  // Handle add todo action
  if (action.type === "ADD_TODO") {
    const newItem = {
      id: "task_" + new Date().getTime(),
      label: action.label ?? "-",
      done: false,
    };
    return [...state, newItem];
  }

  // Handle remove todo action
  if (action.type === "REMOVE_TODO") {
    return state.filter(({ id }) => id !== action.id);
  }

  // Handle toggle todo action
  if (action.type === "TOGGLE_TODO") {
    return state.map((item) =>
      item.id !== action.id
        ? item
        : {
            ...item,
            done: !item.done,
          },
    );
  }

  throw new Error("Unknown action type");
};

export default itemsReducer;
