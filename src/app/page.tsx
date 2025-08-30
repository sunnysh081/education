import Image from "next/image";
import { redirect, RedirectType } from "next/navigation";

export default function Home() {
  return (
    redirect("/dashboard", RedirectType.push)
  );
}
