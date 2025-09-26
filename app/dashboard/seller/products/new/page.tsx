import { redirect } from "next/navigation"

export default function NewProductPage() {
  // Redirect to the existing add-product page
  redirect("/dashboard/seller/add-product")
}