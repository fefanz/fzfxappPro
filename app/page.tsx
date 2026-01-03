import { redirect } from "next/navigation";
import { auth } from "../auth";
import TradeAppClient from "./TradeAppClient";

export default async function Home() {
  const session = await auth();
  if (!session) redirect("/landing");
  return <TradeAppClient />;
}
