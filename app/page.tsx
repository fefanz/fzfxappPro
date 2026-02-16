import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import TradeAppClient from "./TradeAppClient";

export default async function Home() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/landing");
  return <TradeAppClient />;
}
