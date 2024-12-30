"use client"

import BaitDisplay from "@/components/bait-widget";
import { MainContext } from "@/context/main-context";
import { UserData } from "@/lib/types";
import { WalletMinimal } from "lucide-react";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";

const INITIAL_BAITS = 10
const INITIAL_RECOVERY = 1800000

export default function Home() {

  const context = useContext(MainContext);
  const currentUser = context?.currentUser;
  const setCurrentUser = context?.handleSetCurrentUser;
  const getCurrentUser = context?.getCurrentUser;

  const [recoveryInterval, setRecoveryInterval] = useState<number>()
  const [maxBait, setMaxBait] = useState<number>()

  useEffect(() => {
      //localStorage.clear()
      if (currentUser) {
        setMaxBait(INITIAL_BAITS + currentUser.bonus_points)
        setRecoveryInterval(Math.max(INITIAL_RECOVERY - (currentUser.recovery_multiplier - 1) * 60000, 60000))
      }
      
  }, [])

  if (!currentUser) {
      return (
          <div className='w-full mt-10 max-w-lg flex flex-col gap-5 justify-center items-center text-white'>
              <div>Подключи кошелек, чтобы начать рыбалку</div>
              <Link href="/profile">
                  <button className='flex items-center gap-2 bg-[#2980b9] p-2 rounded-lg'><WalletMinimal />Подключить</button>
              </Link>
          </div>
      )
  }

  return (
    <div className="flex flex-col items-center max-w-lg w-full">
      <h1 className="text-2xl text-white font-bold">АКВАТОРИЯ</h1>
      <BaitDisplay 
        maxBait={maxBait}
        recoveryRate={1}
        recoveryInterval={recoveryInterval}
        onBaitUpdate={bait => console.log(bait)} />
    </div>
  );
}
