import Likes from "@/components/Views/Likes";
import React from "react";

export const dynamic = "force-dynamic"; // remove cache
const page = () => {
  return <Likes />;
};

export default page;
