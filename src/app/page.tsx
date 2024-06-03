"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import CategoryCard from "./components/CategoryCard";
import ErrorScreen from "./components/ErrorScreen";
import LoadingScreen from "./components/LoadingScreen";
import PlusIcon from "./components/PlusIcon";
import AddCategoryCard from "./components/AddCategoryCard";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  closestCorners,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { toast } from "sonner";
import { Category } from "@/utils/types";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null as null | string);
  const [categories, setCategories] = useState([] as Category[]);
  const [trigger, setTrigger] = useState(false);
  const [addMode, setAddMode] = useState(false);

  const deleteCategory = (categoryId: string) => {
    axios
      .post("http://andreipredoi.ddns.net:4000/deleteCategory", { categoryId })
      .then((result) => {
        toast.success(`Categoria a fost stearsă`);
        setCategories(categories.filter((c) => c.id !== categoryId));
      })
      .catch((error) => {
        toast.error(error?.data ? error?.data.message : error.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const addCategory = (category: Category) => {
    axios
      .post("http://andreipredoi.ddns.net:4000/addCategory", {
        ...category,
        order:
          categories.map((i) => i.order).reduce((max, i) => Math.max(max, i)) +
          1,
      })
      .then((result) => {
        setCategories([...categories, result.data]);
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message ?? error.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    axios
      .get("http://andreipredoi.ddns.net:4000/categories")
      .then((result) => {
        setCategories(result.data);
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setIsLoading(false);
      });

    return () => {
      setCategories([]);
      setIsLoading(true);
      setError(null);
    };
  }, [trigger]);

  const seedData = () => {
    axios
      .get("http://andreipredoi.ddns.net:4000/seed")
      .then((result) => {
        setTrigger(!trigger);
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message ?? error.message);
      });
  };

  const DragHandler = (event: any) => {
    const { active, over } = event;

    if (active.id === over.id) return;

    const originalPos = categories.findIndex((c) => c.id === active.id);
    const newPos = categories.findIndex((c) => c.id === over.id);

    setCategories(
      arrayMove(categories, originalPos, newPos).map((c, i) => {
        return { ...c, order: i };
      })
    );

    axios
      .post("http://andreipredoi.ddns.net:4000/setOrderCategories", {
        categoryIds: arrayMove(categories, originalPos, newPos).map(
          (c) => c.id
        ),
      })
      .catch((error) => {
        setCategories(
          arrayMove(categories, originalPos, newPos).map((c, i) => {
            return { ...c, order: i };
          })
        );
        toast.error(error?.response?.data?.message ?? error.message);
      });
  };
  

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  if (isLoading) return <LoadingScreen />;
  if (error)
    return (
      <ErrorScreen
        text={error}
        refreshCallback={() => {
          setTrigger(!trigger);
        }}
      />
    );

  return (
    <DndContext sensors={sensors} onDragEnd={DragHandler} collisionDetection={closestCorners}>
      <main className="flex items-center pt-28 max-[390px]:justify-center min-[390px]:pl-[17%] overflow-x-hidden w-full">
        <div className="flex flex-col gap-6">
          <div className="font-semibold text-2xl">To Do</div>
          {categories.length ? (
            <div className="flex flex-col gap-6">
              <SortableContext
                items={categories}
                strategy={verticalListSortingStrategy}
              >
                {categories
                  .toSorted((a: Category, b: Category) => a.order - b.order)
                  .map((c) => (
                    <CategoryCard
                      key={c.id}
                      category={c}
                      deleteCategory={deleteCategory}
                    />
                  ))}
              </SortableContext>
            </div>
          ) : (
            <div className="text-red-600">Nothing to do here</div>
          )}
          {addMode && (
            <AddCategoryCard
              addModeSetter={setAddMode}
              saveCategory={addCategory}
            />
          )}
          <button
            onClick={() => setAddMode(true)}
            className="px-4 py-2 rounded-full flex items-center w-fit bg-primary text-white gap-2 font-semibold"
          >
            <PlusIcon />
            Adaugă categorie
          </button>
        </div>
        <button
          onClick={seedData}
          className=" px-2 py-1 rounded-full border-primary border fixed top-2 right-2 bg-white"
        >
          Seed Data
        </button>
      </main>
    </DndContext>
  );
}
