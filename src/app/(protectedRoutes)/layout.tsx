import { onAuthenticatedUser } from "@/actions/auth";
import Header from "@/components/ReusableComponents/LayoutComponents/Header";
import Sidebar from "@/components/ReusableComponents/LayoutComponents/Sidebar";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  children: React.ReactNode;
};

const layout = async ({ children }: Props) => {
  const userExists = await onAuthenticatedUser();
  if (!userExists.user) {
    redirect("/");
  }
  return (
    <div className="flex w-full mih-h-screen">
      <Sidebar />

      <Header user={userExists.user} />
      <div className="flex flex-col w-full h-screen overflow-auto px-4 scrollbar-hide container mx-auto">
        {children}
      </div>
    </div>
  );
};

export default layout;
