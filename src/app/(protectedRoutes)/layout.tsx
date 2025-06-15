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
    <div className="flex min-h-screen">
      {/* Sidebar stays on the side */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header user={userExists.user} />

        <div className="flex-1 overflow-auto px-4 scrollbar-hide container mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default layout;
