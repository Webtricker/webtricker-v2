import { ReactNode } from "react";

type PropsType = {
  className?: string;
  children: ReactNode;
};

export default function BlogPageContainer ({ className, children }: PropsType){
  return (
    <div
      // className={`${className} px-5 md:px-7 lg:px-10 xl:px-[60px] w-full max-w-[1032px] mx-auto`}
      className={`${className} px-5 md:px-7 lg:px-10 xl:px-[60px] w-full max-w-[1240px] mx-auto`}
    >
      {children}
    </div>
  )
}
