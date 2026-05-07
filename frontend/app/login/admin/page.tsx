import { redirect } from "next/navigation"

export default function AdminRouteRedirectPage() {
  redirect("/login/admin/private")
}
