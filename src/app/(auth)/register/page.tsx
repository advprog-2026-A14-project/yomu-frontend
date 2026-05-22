import { redirect } from "next/navigation";

const page = () => {
  redirect("/auth/register");
}

export default page
