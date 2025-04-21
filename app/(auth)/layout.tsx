import Image from "next/image";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="md:min-h-screen flex md:flex-row flex-col md:items-center gap-28 p-4 w-fit max-w-screen mx-auto pt-10">
      <div className="flex-1 max-w-full hidden md:block">
        <Image
          src="/assets/people-edited.png"
          width={500}
          height={500}
          alt="insta ulster form"
          className="max-w-[420px] w-full rounded-br-3xl"
        />
      </div>
      <div className=" flex justify-center gap-4 flex-col w-fit mx-auto">
        {" "}
        <div>
          <Image
            src="/assets/insta_ulster_logo.svg"
            width={165}
            height={41}
            alt="insta ultser logo"
          />
        </div>
        {children}
      </div>
    </div>
  );
};

export default layout;
