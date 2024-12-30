"use client"

import { UserData } from '@/lib/types';
import { createContext, useEffect, useState } from 'react';

import { TMainContext } from '@/lib/types';

export const MainContext = createContext<TMainContext | undefined>(undefined)

export const MainProvider = ({ children }: Readonly<{children: React.ReactNode}>) => {

    const [currentUser, setCurrentUser] = useState<UserData>()

    const handleSetCurrentUser = async (address: string) => {
        const response = await fetch(`/api/users?address=${address}`)
        const userData = await response.json()
        console.log(userData.results);
        
        setCurrentUser(userData.results[0])
        sessionStorage.setItem('user', JSON.stringify(userData.results[0]))
    }

    const getCurrentUser = () => {
        setCurrentUser(JSON.parse(sessionStorage.getItem("user")!))
    }

    useEffect(() => {
        getCurrentUser()
    }, [])

    return (
        <MainContext.Provider value={{ currentUser, handleSetCurrentUser, getCurrentUser }}>
            {children}
        </MainContext.Provider>
    )
}