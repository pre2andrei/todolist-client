import { closestCorners, DndContext } from "@dnd-kit/core";
import { arrayMove, SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import axios from "axios";
import { motion } from "framer-motion";
import { useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { toast } from "sonner";

import ArrowIcon from "./ArrowIcon";
import CancelIcon from "./CancelIcon";
import DeleteIcon from "./DeleteIcon";
import DeleteModal from "./DeleteModal";
import DraggableIcon from "./DraggableIcon";
import EditIcon from "./EditIcon";
import EditItemRow from "./EditItemRow";
import ItemRow from "./ItemRow";
import SaveIcon from "./SaveIcon";
import { Category, Item, Measurement } from "@/utils/types";

interface Props {
  category: Category;
  deleteCategory: Function;
}

const CategoryCard = ({ category, deleteCategory }: Props) => {
  const [state, setState] = useState(category);
  const [isOpen, setIsOpen] = useState(false);
  const [addMode, setAddMode] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: category.id });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const submit = (data: FieldValues) => {
    axios
      .post("http://andreipredoi.ddns.net:4000/editCategory", {
        name: data.name,
        id: category.id,
      })
      .then((result) => {
        setState(result.data);
        setEditMode(false);
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message ?? error.message);
      });
  };

  const deleteItem = (itemId: string) => {
    setState({ ...state, items: state.items.filter((i) => i.id != itemId) });
  };

  const checkItem = (itemId: string, value: boolean) => {
    const newItems = state.items;
    for (let i = 0; i < newItems.length; i++) {
      if (newItems[i].id == itemId) newItems[i].checked = value;
    }
    setState({ ...state, items: newItems });
  };

  const checkedItemsNr = state.items.filter((i) => i.checked).length;
  const itemsNr = state.items.length;

  const DragHandler = (event: any) => {
    const { active, over } = event;

    if (active.id === over.id) return;

    const originalPos = state.items.findIndex((c) => c.id === active.id);
    const newPos = state.items.findIndex((c) => c.id === over.id);

    const oldstate = state;
    setState({
      ...state,
      items: arrayMove(state.items, originalPos, newPos).map((c, i) => {
        return { ...c, order: i };
      }),
    });

    axios
      .post("http://andreipredoi.ddns.net:4000/setOrderItems", {
        itemsIds: arrayMove(state.items, originalPos, newPos).map((c) => c.id),
      })
      .then((result) => {})
      .catch((error) => {
        toast.error(error?.response?.data?.message ?? error.message);
        setState(oldstate);
      });
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      style={style}
      className="flex items-center gap-1"
    >
      <div className="py-[10px] border border-gray-400 rounded-2xl w-[50vw] min-w-64 max-w-[476px] bg-white">
        <form onSubmit={handleSubmit(submit)}>
          <div
            className={`flex flex-col ${
              isOpen ? "border-b-[1px] border-gray-400 mb-5" : ""
            }`}
          >
            {isOpen && (
              <div className="flex items-center">
                {editMode ? (
                  <input
                    autoFocus
                    {...register("name", {
                      required: true,
                    })}
                    type="text"
                    className={`border focus:border-0 rounded-lg ${
                      errors?.name?.type === "required"
                        ? "border-red-600"
                        : "border-gray-400"
                    } px-2 font-semibold w-full mx-4`}
                    placeholder="Name"
                  />
                ) : (
                  <div className="font-semibold w-full mx-4">
                    {state.name}
                  </div>
                )}
              </div>
            )}
            <div
              className={`flex text-primary justify-between py-1 items-center px-4 max-md:px-2`}
            >
              <div className="flex h-4 items-center md:gap-2 ">
                {editMode && !isOpen ? (
                  <input
                    autoFocus
                    {...register("name", {
                      required: true,
                    })}
                    type="text"
                    className={`flex-1 border focus:border-0 rounded-lg ${
                      errors?.name?.type === "required"
                        ? "border-red-600"
                        : "border-gray-400"
                    } px-2 font-semibold max-w-28`}
                    placeholder="Name"
                  />
                ) : (
                  <>
                    {!isOpen && (
                      <span className="font-bold text-black max-w-28 text-nowrap text-ellipsis overflow-hidden ...">
                        {state.name}
                      </span>
                    )}
                  </>
                )}

                <span
                  onClick={() => {
                    setIsOpen(!isOpen);
                  }}
                >
                  <div
                    className={`transition duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  >
                    <ArrowIcon />
                  </div>
                </span>
              </div>

              {itemsNr > 0 && (
                <div className="flex-1  md:ml-3 mr-3 flex items-center ">
                  <div className="h-2 flex-1 rounded-lg border  border-gray-400 max-md:hidden">
                    <motion.div
                      transition={{ duration: 0.3 }}
                      animate={{
                        width: `${Math.round(
                          (checkedItemsNr / itemsNr) * 100
                        )}%`,
                      }}
                      style={{
                        width: `${Math.round(
                          (checkedItemsNr / itemsNr) * 100
                        )}%`,
                      }}
                      className="bg-primary h-2 rounded-lg"
                    ></motion.div>
                  </div>
                  <div className="text-primary rounded-lg md:ml-3">{`${checkedItemsNr}/${itemsNr}`}</div>
                </div>
              )}
              {editMode ? (
                <div className="flex gap-1">
                  <button type="submit">
                    <SaveIcon />
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      setEditMode(false);
                    }}
                  >
                    <CancelIcon />
                  </button>
                </div>
              ) : (
                <div className="flex gap-1">
                  <button
                    onClick={() => {
                      setEditMode(true);
                    }}
                  >
                    <EditIcon />
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setDeleteMode(true);
                    }}
                  >
                    <DeleteIcon />
                  </button>
                </div>
              )}
            </div>
          </div>
        </form>
        <motion.div
          className={`flex flex-col gap-2 pl-1 md:px-4 overflow-hidden w-full`}
          animate={{ height: isOpen ? "auto" : "0px" }}
          transition={{ duration: 0.3 }}
          style={{ height: isOpen ? "auto" : "0px" }}
        >
          <DndContext
            onDragEnd={DragHandler}
            collisionDetection={closestCorners}
          >
            <SortableContext items={state.items}>
              {state.items
                .toSorted((a: Item, b: Item) => a.order - b.order)
                .map((item) => (
                  <ItemRow
                    key={item.id}
                    item={item}
                    itemDeleteFunction={deleteItem}
                    itemCheckFunction={checkItem}
                    category={state}
                    categorySetter={setState}
                  />
                ))}
            </SortableContext>
          </DndContext>

          {addMode && (
            <EditItemRow
              category={state}
              item={
                {
                  name: "",
                  measurement: Measurement.NONE,
                  quantity: 0,
                } as Item
              }
              modeSetter={setAddMode}
              categorySetter={setState}
            />
          )}
          <div>
            <button
              onClick={() => {
                setAddMode(true);
              }}
              className="border border-primary px-2 py-1 rounded-full font-semibold"
            >
              Adaugă item
            </button>
          </div>
        </motion.div>
        {deleteMode && (
          <DeleteModal
            deleteCategory={deleteCategory}
            category={state}
            deleteModeSetter={setDeleteMode}
          />
        )}
      </div>
      <div {...listeners} className="text-primary">
        <DraggableIcon />
      </div>
    </div>
  );
};

export default CategoryCard;
