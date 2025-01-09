"use client"

import { MainContext } from "@/context/main-context";
import { BaitData, UserData } from "@/lib/types";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";

interface ImprovementProps {
    name: string;
    imp: string;
    price: number;
    icon: string;
    currentUser?: UserData;
    fieldName: string;
}


export const Improvement = ({ name, imp, price, icon, fieldName }: ImprovementProps) => {

    const context = useContext(MainContext);
    const currentUser = context?.currentUser;
    const setCurrentUser = context?.handleSetCurrentUser;
    const getCurrentUser = context?.getCurrentUser;

    const [isLoading, setIsLoading] = useState<boolean>(false)


    const handleClick = async () => {
        setIsLoading(true)

        const response = await fetch("/api/shop", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'improve',
                fieldName: fieldName,
                address: currentUser?.address
            })
        })
        const data = await response.json()
        setCurrentUser!(currentUser!.address)

        if (fieldName === "recovery_multiplier") {
            const rawBaitData = localStorage.getItem("userBait")
            if (rawBaitData) {
                const baitData = JSON.parse(rawBaitData) as BaitData

                localStorage.setItem("userData", JSON.stringify({...baitData, lastUpdate: baitData.lastUpdate + 60*1000}))
            }    
        }
        

        setIsLoading(false)
    }

    return (
        <div className="w-full py-3 px-5 my-4 flex items-center justify-around bg-white/10 custom-blur shadow-2xl rounded-lg">
            <Image width={34} height={34} className='mr-2' src={icon} alt='FEFU Crypto Button Logo' />
            <div className="flex items-center mr-5 flex-1">
                <div className="ml-2 flex flex-col gap-1">
                    <div className="leading-snug text-sm text-white/70 font-bold">{name}</div>
                    <div className="leading-snug text-xs text-gray-200">{imp}</div>
                    <div className="leading-snug text-xs text-gray-200">{price} FEFU</div>
                </div>
            </div>
            <button type="button" 
                    onClick={price <= currentUser!.balance ? handleClick : () => {}}
                    className={`${price > currentUser!.balance && "opacity-70"} text-gray-900 w-28 h-10 bg-white/70 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex justify-center items-center dark:focus:ring-gray-500 my-2`}>
                <BeatLoader loading={isLoading} />
                {!isLoading && <>
                    <Image width={14} height={14} className='mr-2' src='/button-logo.svg' alt='FEFU Crypto Button Logo' />
                    Купить
                </>}
            </button>
        </div>
    )
}