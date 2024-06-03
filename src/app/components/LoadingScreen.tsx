import LoadingIcon from "./LoadingIcon";

const LoadingScreen = () => {
  return (
    <div className="w-full h-full flex justify-center items-center text-primary">
      <div className="animate-spin">
        <LoadingIcon />
      </div>
    </div>
  );
};

export default LoadingScreen;
