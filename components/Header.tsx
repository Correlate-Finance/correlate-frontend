import React from "react";
import { Separator } from "./ui/separator";

const Header = () => {
  return (
    <header className="flex-row justify-items-center">
      <h1 className="text-[28px] text-white mx-6">Correlate</h1>
      <Separator className="bg-neutral-700" />
    </header>
  );
};

export default Header;
