// "use client";

// import { createContext, useContext, useEffect, useState } from "react";

// type Direction = "ltr" | "rtl";

// interface DirectionContextType {
//   direction: Direction;
//   toggleDirection: () => void;
//   isRTL: boolean;
// }

// const DirectionContext = createContext<DirectionContextType | undefined>(
//   undefined,
// );

// export function DirectionProvider({ children }: { children: React.ReactNode }) {
//   // const [direction, setDirection] = useState<Direction>("ltr");
//   // const [mounted, setMounted] = useState(false);

//   // useEffect(() => {
//   //   setMounted(true);
//   //   const saved = (localStorage.getItem("tarvix_dir") as Direction) || "ltr";
//   //   setDirection(saved);
//   //   document.documentElement.dir = saved;
//   // }, []);

//   // const toggleDirection = () => {
//   //   const newDir = direction === "ltr" ? "rtl" : "ltr";
//   //   setDirection(newDir);
//   //   document.documentElement.dir = newDir;
//   //   localStorage.setItem("tarvix_dir", newDir);
//   // };

//   // if (!mounted) return null;

//   // return (
//   //   <DirectionContext.Provider
//   //     value={{
//   //       direction,
//   //       toggleDirection,
//   //       isRTL: direction === "rtl",
//   //     }}
//   //   >
//   //     {children}
//   //   </DirectionContext.Provider>
//   // );
//   return { children };
// }

// export function useDirection() {
//   const context = useContext();

//   return context;
// }
