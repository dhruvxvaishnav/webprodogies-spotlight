import { onAuthenticatedUser } from "@/actions/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

const AuthCallbackPage = async () => {
  const auth = await onAuthenticatedUser();
  if (auth.status === 200 || auth.status === 201) {
    redirect("/home");
  } else if (
    auth.status === 403 ||
    auth.status === 400 ||
    auth.status === 500
  ) {
    redirect("/");
  } else {
    redirect("/");
  }
};

export default AuthCallbackPage;
