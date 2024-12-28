"use client"

import { useEffect, useState } from "react"

interface ReferralSystemProps {
    initData: string;
    userId: string;
    startParam: string;
}

const ReferralSystem: React.FC<ReferralSystemProps> = ({ initData, userId, startParam }) => {

    const [referrals, setReferrals] = useState<string[]>([])
    const [referrer, setReferrer] = useState<string | null>(null)
    const INVITE_URL = 'https://t.me/fefu_crypto_bot/start'

    useEffect(() => {
        const checkReferral = async () => {
            if (startParam && userId) {
                try {
                    const response = await fetch("/api/referrals", {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ userId, referrerId: startParam })
                    })
                    if (!response.ok) {
                        throw new Error("Failed to save referral")
                    }
                } catch (error) {
                    console.error("Error saving referral", error);
                }
            }
        }

        const fetchReferrals = async () => {
            if (userId) {
                try {
                    const response = await fetch(`/api/referrals?userId=${userId}`)
                    if (!response.ok) {
                        throw new Error("Failed to fetch referrals")
                    }

                    const { referrals, referrer } = await response.json()

                    setReferrals(referrals)
                    setReferrer(referrer)
                } catch (error) {
                    console.error("Error fetching referrals:", error)
                }
            }
        }

        checkReferral()
        fetchReferrals()
    }, [userId, startParam])

    const handleInviteFriend = () => {
        const utils = initUtils()
        const inviteLink = `${INVITE_URL}?startapp=${userId}`
        const shareText = "Join me on this awesome Telegram mini app"
        const fullUrl = `https://t.me/share/url?url=${encodeURIComponent(inviteLink)}&text=${encodeURIComponent(shareText)}`
        utils.openTelegramLink(fullUrl)
    }

    const handleCopyLink = () => {
        const inviteLink = `${INVITE_URL}?startapp=${userId}`
        navigator.clipboard.writeText(inviteLink)
        alert("Invite link copied to clipboard")
    }

    return (
        <div>

        </div>
    )

}

export default ReferralSystem