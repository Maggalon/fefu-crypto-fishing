"use client"

import { Improvement } from "@/components/improvement"
import { SellOption } from "@/components/sell-option"
import { MainContext } from "@/context/main-context"
import { WalletMinimal } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useContext, useState } from "react"


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

    const [isLoading, setIsLoading] = useState({
        fish: false,
        squid: false,
        pearl: false
    })
    
    const handleSell = async (type: "fish" | "squid" | "pearl") => {

        setIsLoading({
            ...isLoading,
            [type]: true
        })

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

        setIsLoading({
            ...isLoading,
            [type]: false
        })
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
                <SellOption name="Рыба"
                            quantity={currentUser!.fish}
                            price={PRICES.fish}
                            handleSell={() => handleSell("fish")}
                            isLoading={isLoading.fish} />
                <SellOption name="Кальмар"
                            quantity={currentUser!.squid}
                            price={PRICES.squid}
                            handleSell={() => handleSell("squid")}
                            isLoading={isLoading.squid} />
                <SellOption name="Жемчуг"
                            quantity={currentUser!.pearl}
                            price={PRICES.pearl}
                            handleSell={() => handleSell("pearl")}
                            isLoading={isLoading.pearl} />
            </div>
            <Improvement name="Улучшить рыболовные снасти"
                         imp="+ 0.1 к множителю улова"
                         price={currentUser ? Math.ceil(2**((currentUser.extraction_multiplier - 1) / 0.1) * 1000) : 1000}
                         icon="/fishing-rod.svg"
                         fieldName="extraction_multiplier" />
            <Improvement name="Улучшить приманку"
                         imp="- 1 мин. к восстановлению наживки"
                         price={currentUser ? Math.ceil(2**(currentUser.recovery_multiplier - 1)) * 1000 : 1000}
                         icon="/lure.svg"
                         fieldName="recovery_multiplier" />
        </div>
    )
}