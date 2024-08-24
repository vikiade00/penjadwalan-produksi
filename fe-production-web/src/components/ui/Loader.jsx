import React from "react";
import { Rings } from "react-loader-spinner";

const Loader = () => {
  return (
    <div className="flex justify-center items-center h-full">
      <Rings color="#00BFFF" height={80} width={80} />
    </div>
  );
};

export default Loader;
