import { MouseEvent, MouseEventHandler } from "react";
import RefreshIcon from "./RefreshIcon";

interface Props {
  text: string;
  refreshCallback: MouseEventHandler
}

const ErrorScreen = ({ text,refreshCallback }: Props) => {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center text-red-600">
      <div >{text}</div>
      <button onClick={refreshCallback} className="px-2 py-1 text-white rounded-lg bg-primary flex gap-1 items-center justify-between">
            Refresh <RefreshIcon />
          </button>
    </div>
  );
};

export default ErrorScreen;
