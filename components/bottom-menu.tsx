"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Store, Fish, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
    { href: "/", icon: Fish, label: "Fishing" },
    { href: "/shop", icon: Store, label: "Shop" },
    { href: "/profile", icon: Users, label: "Profile" },
];

const BottomMenu = () => {

    const pathName = usePathname()

    return (
        <div className="fixed flex justify-center z-50 w-full h-16 max-w-lg -translate-x-1/2 bg-[#3F7FAA] shadow-2xl rounded-full bottom-4 left-1/2">
          <div className="flex justify-around h-full w-full max-w-md">
            {navItems.map(({ href, icon: Icon, label }) => {
                const isActive = pathName === href;
                return (
                    <Link
                        key={href}
                        href={href}
                        className={cn(
                        "flex flex-col items-center justify-center w-16 h-16 transition-colors",
                        isActive
                            ? "text-white"
                            : "text-gray-300"
                        )}
                    >
                        <Icon className="h-8 w-8" />
                        {/* <span className="text-xs mt-1">{label}</span> */}
                    </Link>
                );
            })}
          </div>
        </div>
    )
}

export default BottomMenu;