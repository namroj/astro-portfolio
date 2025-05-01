import { atom } from "nanostores";

const getInitialShowLineNumbers = () => {
  if (typeof window !== "undefined") {
    return (
      (localStorage.getItem("showLineNumbers") as unknown as boolean) ?? true
    );
  }
  return true;
};

export const showLineNumbers = atom<boolean>(getInitialShowLineNumbers());
