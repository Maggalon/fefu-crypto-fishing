"use client"

import { Improvement } from "@/components/improvement"
import { MainContext } from "@/context/main-context"
import { WalletMinimal } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useContext } from "react"


const PRICES = {
    fish: 100,
    squid: 250,
    pearl: 5000
}

export default function Shop() {

    const context = useContext(MainContext);
    const currentUser = context?.currentUser;
    const setCurrentUser = context?.handleSetCurrentUser;
    const getCurrentUser = context?.getCurrentUser;


    
    const handleSell = async (type: "fish" | "squid" | "pearl") => {

        const response = await fetch('/api/shop', {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'sell',
                fieldName: type,
                newValue: currentUser![type] * PRICES[type] + currentUser!.balance,
                address: currentUser?.address
            })
        })
        const data = await response.json()
        console.log(data);

        setCurrentUser!(data.userData.address)
        getCurrentUser!()
    }

    if (!currentUser) {
        return (
            <div className='w-full mt-10 max-w-lg flex flex-col gap-5 justify-center items-center text-white'>
                <div>Подключи кошелек, чтобы перейти в магазин</div>
                <Link href="/profile">
                    <button className='flex items-center gap-2 bg-[#2980b9] p-2 rounded-lg'><WalletMinimal />Подключить</button>
                </Link>
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center w-full max-w-lg">
            <h1 className="text-2xl text-white font-bold">МАГАЗИН</h1>
            <div className="w-full py-3 px-5 my-4 flex flex-col items-center justify-around bg-white/10 custom-blur shadow-2xl rounded-lg">
                <div className="w-full grid grid-cols-3 items-center">
                    <div className="font-medium text-white/70 col-span-3">Рыба</div>
                    <div className="font-medium text-white/70 text-sm ">{currentUser?.fish} шт.</div>
                    <div className="text-white text-sm">{PRICES.fish} FEFU/шт</div>
                    <button type="button" 
                            onClick={() => handleSell("fish")}
                            className="text-gray-900 h-10 bg-white/70 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex justify-center items-center dark:focus:ring-gray-500 my-2">
                        <Image width={14} height={14} className='mr-2' src='/button-logo.svg' alt='FEFU Crypto Button Logo' />
                        Продать
                    </button>
                </div>
                <div className="w-full grid grid-cols-3 items-center">
                    <div className="font-medium text-white/70 col-span-3">Кальмар</div>
                    <div className="font-medium text-white/70 text-sm ">{currentUser?.squid} шт.</div>
                    <div className="text-white text-sm">{PRICES.squid} FEFU/шт</div>
                    <button type="button"
                            onClick={() => handleSell("squid")} 
                            className="text-gray-900 h-10 bg-white/70 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex justify-center items-center dark:focus:ring-gray-500 my-2">
                        <Image width={14} height={14} className='mr-2' src='/button-logo.svg' alt='FEFU Crypto Button Logo' />
                        Продать
                    </button>
                </div>
                <div className="w-full grid grid-cols-3 items-center">
                    <div className="font-medium text-white/70 col-span-3">Жемчуг</div>
                    <div className="font-medium text-white/70 text-sm ">{currentUser?.pearl} шт.</div>
                    <div className="text-white text-sm">{PRICES.pearl} FEFU/шт</div>
                    <button type="button" 
                            onClick={() => handleSell("pearl")}
                            className="text-gray-900 h-10 bg-white/70 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex justify-center items-center dark:focus:ring-gray-500 my-2">
                        <Image width={14} height={14} className='mr-2' src='/button-logo.svg' alt='FEFU Crypto Button Logo' />
                        Продать
                    </button>
                </div>
            </div>
            <Improvement name="Улучшить рыболовные снасти"
                         imp="+ 0.1 к множителю улова"
                         price={currentUser ? Math.floor(2**((currentUser.extraction_multiplier - 1) / 0.1) * 1000) : 1000}
                         icon="/fishing-rod.svg"
                         fieldName="extraction_multiplier" />
            <Improvement name="Улучшить приманку"
                         imp="- 1 мин. к восстановлению наживки"
                         price={currentUser ? Math.floor(2**(currentUser.recovery_multiplier - 1)) : 1000}
                         icon="/lure.svg"
                         fieldName="recovery_multiplier" />
        </div>
    )
}