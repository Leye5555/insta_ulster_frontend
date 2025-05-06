import Home from "@/components/Views/home";

export const dynamic = "force-dynamic"; // remove cache
const page = () => {
  return <Home />;
};

export default page;
