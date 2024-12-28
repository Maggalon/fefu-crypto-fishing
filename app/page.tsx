"use client"

import BaitDisplay from "@/components/bait-widget";
import Image from "next/image";
import { useEffect, useState } from "react";
import { HexGrid, Layout, Hexagon, GridGenerator } from 'react-hexgrid';

const maxBaits = 10

export default function Home() {

  return (
    <div className="flex flex-col items-center max-w-lg w-full">
      <h1 className="text-2xl text-white font-bold">АКВАТОРИЯ</h1>
      <BaitDisplay 
        maxBait={maxBaits}
        recoveryRate={1}
        recoveryInterval={5000}
        onBaitUpdate={bait => console.log(bait)} />
    </div>
  );
}
