"use client";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Category, Item, Measurement } from "@/utils/types";
import axios from "axios";
import { ChangeEvent, ChangeEventHandler, useState } from "react";
import DeleteIcon from "./DeleteIcon";
import DraggableIcon from "./DraggableIcon";
import EditIcon from "./EditIcon";
import EditItemRow from "./EditItemRow";
import { toast } from "sonner";
import LoadingIcon from "./LoadingIcon";
interface Props {
  item: Item;
  itemDeleteFunction: Function;
  itemCheckFunction: Function;
  category: Category;
  categorySetter: Function;
}

const ItemRow = ({
  item,
  itemDeleteFunction,
  itemCheckFunction,
  category,
  categorySetter,
}: Props) => {
  const [editMode, setEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  const { attributes, listeners, setNodeRef, transform, transition,isDragging } =
    useSortable({ id: item.id });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  };

  const deleteItem = () => {
    setIsLoading(true)
    axios
      .post("http://andreipredoi.ddns.net:4000/deleteItem", {
        itemId: item.id,
      })
      .then((result) => {
        itemDeleteFunction(item.id);
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message ?? error.message)
      })
      .finally(()=>{
        setIsLoading(false)
      });
  };

  const checkHandler: ChangeEventHandler<HTMLInputElement> = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    axios
      .post("http://andreipredoi.ddns.net:4000/check", {
        itemId: item.id,
        isChecked: e.target.checked,
      })
      .then((result) => {
        itemCheckFunction(item.id, result.data.checked);
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message ?? error.message)
      });
  };

  if (editMode)
    return (
      <div
        ref={setNodeRef}
        {...attributes}
        style={style}
        className="flex justify-between items-center"
      >
        <EditItemRow
          item={item}
          modeSetter={setEditMode}
          category={category}
          categorySetter={categorySetter}
        />
        <div {...listeners} className="text-primary">
          <DraggableIcon />
        </div>
      </div>
    );

  return (
    <div ref={setNodeRef} {...attributes} style={style} className="flex items-center">
      <div className="flex-1 min-w-32 self-start text-nowrap flex gap-4 overflow-hidden">
        {isLoading ? (
          <div className="md:w-6 md:h-6 accent-primary text-primary">
            <LoadingIcon />
          </div>
        ) : (
          <input
            checked={item.checked}
            type="checkbox"
            onChange={checkHandler}
            className="md:w-6 md:h-6 accent-primary"
          />
        )}
        <span className="w-24 md:w-36 text-ellipsis overflow-hidden ...">
          {item.name}
        </span>
      </div>
      {item.measurement != Measurement.NONE && (
        <span className="flex-1 w-20 text-nowrap">
          {`${item.quantity}${
            item.measurement != Measurement.COUNT
              ? item.measurement.toLocaleLowerCase()
              : ""
          }`}
        </span>
      )}
      <div className="flex gap-1 text-primary">
        <button onClick={toggleEditMode}>
          <EditIcon />
        </button>
        <button onClick={deleteItem}>
          <DeleteIcon />
        </button>
      </div>
      <div {...listeners} className="text-primary py-1">
        <DraggableIcon />
      </div>
    </div>
  );
};

export default ItemRow;
