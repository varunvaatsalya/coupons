import { getAllCategories, getBlogs, getTrendingMerchants } from "@/app/services/navbarServices";
import NavbarClient from "./NavbarClient";

export default async function Navbar() {
  const [merchants, categories, blogs] = await Promise.all([
    getTrendingMerchants(),
    getAllCategories(),
    getBlogs(),
  ]);

  return (
    <NavbarClient merchants={merchants} categories={categories} blogs={blogs} />
  );
}
