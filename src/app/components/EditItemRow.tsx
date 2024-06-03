import { onlyNumbersKeyDownEvent } from "@/utils/inputUtils";
import axios from "axios";
import { ChangeEvent, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";

import CancelIcon from "./CancelIcon";
import SaveIcon from "./SaveIcon";
import { toast } from "sonner";
import { Category, Item, Measurement } from "@/utils/types";

interface Props {
  categorySetter: Function;
  item: Item;
  category: Category;
  modeSetter: Function;
}

const EditItemRow = ({ item, categorySetter, modeSetter, category }: Props) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const watchMeasurement = watch("measurement", item.measurement);

  const saveItem = (data: FieldValues) => {
    axios
      .post(
        item.id
          ? "http://andreipredoi.ddns.net:4000/editItem"
          : "http://andreipredoi.ddns.net:4000/addItem",
        {
          ...(item.id && { itemId: item.id }),
          categoryId: category.id,
          name: data.name,
          ...(data.measurement!==Measurement.NONE && { quantity: +(data.quantity) }),
          measurement: data.measurement,
          order:
           category.items.length ? category.items
              .map((i) => i.order)
              .reduce((max, i) => Math.max(max, i)) + 1 : 1,
        }
      )
      .then((result) => {
        if (item.id) {
          const newItems = category.items;
          for (let i = 0; i < newItems.length; i++) {
            if (newItems[i].id == item.id) newItems[i] = result.data;
          }
          categorySetter({ ...category, items: newItems });
        } else
          categorySetter({
            ...category,
            items: [...category.items, result.data],
          });
        modeSetter(false);
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message ?? error.message)
      });
  };

  return (
    <form
      onSubmit={handleSubmit(saveItem)}
      className="flex-1 flex items-center max-[845px]:flex-col max-[845px]:items-start gap-1"
    >
      <div className="min-w-32 self-start text-nowrap flex gap-4 overflow-hidden">
        <input
          // onChange={(e: ChangeEvent<HTMLInputElement>) => {
          //   setName(e.target.value);
          // }}
          {...register("name", {
            required: true,
            value: item.name,
          })}
          type="text"
          className={`border rounded-lg min-[845px]:ml-8 w-32 ${
            errors?.name?.type === "required"
              ? "border-red-600"
              : "border-gray-400"
          } px-2`}
          placeholder="name"
        />
      </div>
      {watchMeasurement !== Measurement.NONE && (
        <input
          {...register("quantity", {
            value: item.quantity,
            min:0
          })}
          defaultValue={0}
          type="number"
          className={`border rounded-lg w-20 "border-gray-400 px-2`}
          placeholder="quantity"
        />
      )}
      <select
        className="border rounded-lg border-gray-400 px-1"
        defaultValue={Measurement.NONE}
        {...register("measurement", {
          value: item.measurement,
          required: true,
        })}
      >
        <option value={Measurement.G}>g</option>
        <option value={Measurement.ML}>ml</option>
        <option value={Measurement.COUNT}>count</option>
        <option value={Measurement.NONE}>--</option>
      </select>

      <div className="flex gap-1 text-primary flex-1 justify-end">
        <button type="submit">
          <SaveIcon />
        </button>
        <button
          onClick={() => {
            modeSetter(false);
          }}
        >
          <CancelIcon />
        </button>
      </div>
    </form>
  );
};

export default EditItemRow;
