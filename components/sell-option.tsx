"use client"

import Image from "next/image"
import { MouseEventHandler } from "react";
import { BeatLoader } from "react-spinners";

interface SellOptionProps {
    name: string;
    quantity: number;
    price: number;
    handleSell: MouseEventHandler<HTMLButtonElement>;
    isLoading: boolean;
}

export const SellOption = ({ name, quantity, price, handleSell, isLoading }: SellOptionProps) => {

    return (
        <div className="w-full grid grid-cols-3 items-center">
            <div className="font-medium text-white/70 col-span-3">{name}</div>
            <div className="font-medium text-white/70 text-sm ">{quantity} шт.</div>
            <div className="text-white text-sm">{price} FEFU/шт</div>
            <button type="button" 
                    onClick={quantity !== 0 ? handleSell : () => {}}
                    className={`${quantity === 0 ? "opacity-70" : ""} text-gray-900 h-10 bg-white/70 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex justify-center items-center dark:focus:ring-gray-500 my-2`}>
                <BeatLoader loading={isLoading} />
                {!isLoading && <>
                    <Image width={14} height={14} className='mr-2' src='/button-logo.svg' alt='FEFU Crypto Button Logo' />
                    Продать
                </>}
                
            </button>
        </div>
    )
}