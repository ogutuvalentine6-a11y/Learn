import { ReactNode } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

interface LayoutProps {
  role: "student" | "staff" | "admin";
  name?: string;
  children: ReactNode;
}

export default function Layout({ role, name, children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar role={role} name={name} />
      <div className="mx-auto flex max-w-7xl">
        <Sidebar role={role} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
