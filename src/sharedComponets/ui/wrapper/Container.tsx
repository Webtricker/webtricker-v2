import { ReactNode } from "react";

type PropsType = {
  className?: string;
  children: ReactNode;
};

const Container = ({ className='', children }: PropsType) => {
  return (
    <div
      className={`${className} px-5 md:px-7 lg:px-10 xl:px-[60px] w-full max-w-[1750px] mx-auto`}
    >
      {children}
    </div>
  );
};

export default Container;
