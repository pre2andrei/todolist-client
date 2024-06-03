"use client";

import { Category } from "@/utils/types";


interface Props {
  category: Category;
  deleteCategory: Function;
  deleteModeSetter: Function;
}
const DeleteModal = ({ deleteModeSetter, category, deleteCategory }: Props) => {
  return (
    <>
      <div
        onClick={() => {
          deleteModeSetter(false);
        }}
        className="bg-black opacity-40 fixed w-screen h-screen top-0 left-0"
      ></div>
      <div className="fixed bg-white w-80 h-40 top-[calc(50vh-80px)] left-[calc(50vw-160px)] p-2 flex flex-col justify-evenly items-center rounded-lg">
        <div className="font-semibold">{category.name}</div>
        <div>Ești sigur?</div>
        <div className="flex justify-evenly w-full">
          <button
            onClick={() => {
               deleteCategory(category.id);
               deleteModeSetter(false);
            }}
            className="w-20 h-10 bg-primary text-white rounded-full"
          >
            Da
          </button>
          <button
            onClick={() => {
              deleteModeSetter(false);
            }}
            className="w-20 h-10 bg-red-600 text-white rounded-full"
          >
            Nu
          </button>
        </div>
      </div>
    </>
  );
};

export default DeleteModal;
