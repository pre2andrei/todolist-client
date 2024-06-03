import { ChangeEvent, useState } from "react";
import CancelIcon from "./CancelIcon";
import SaveIcon from "./SaveIcon";

interface Props {
  saveCategory: Function;
  addModeSetter: Function;
}

const AddCategoryCard = ({ addModeSetter, saveCategory }: Props) => {
  const [newName, setNewName] = useState("");

  return (
    <div className="py-[10px] border border-gray-400 rounded-2xl w-[50vw] min-w-64 max-w-[476px]">
      <div className= "flex text-primary justify-between py-1 items-center px-4 max-md:px-2">
        <div className="flex-1 flex h-4 items-center gap-2 ">
          <input
            autoFocus
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setNewName(e.target.value);
            }}
            value={newName}
            type="text"
            className="border rounded-lg border-gray-400 px-2 text-black font-semibold max-w-44"
            placeholder="name"
          />
        </div>

        <div className="flex gap-1">
          <button
            onClick={() => {
              saveCategory({ name: newName });
              addModeSetter(false);
            }}
          >
            <SaveIcon />
          </button>
          <button
            onClick={() => {
              addModeSetter(false);
            }}
          >
            <CancelIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCategoryCard;
