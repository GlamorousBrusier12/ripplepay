"use client";
import { useBalance } from "@repo/store/usebalance";

export default function Home() {
  const balance = useBalance();
  return <div className="text-2xl">hi there {Number(balance)}</div>;
}
