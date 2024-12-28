import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { generateUniqueCode } from "@/lib/utils";

interface RequestProps {
    action: string;
    userId: string;
    referralCode: string;
    referrerId: string;
}

export async function POST(req: NextRequest) {
    const data = await req.json()
    const { action, referralCode, address } = data

    switch (action) {
        case 'checkRefCode':

            const { data: userData, error: userError } = await supabase
                .from("users")
                .select("*")
                .eq("referral_code", referralCode)
                .single()

            // const code = generateUniqueCode()
            // const { data: userData, error: userError } = await supabase
            //     .from('users')
            //     .update({ referral_code: code })
            //     .eq('id', userId)
            //     .select()
            //     .single()

            if (userError) return NextResponse.json({ error: userError.message, status: 400 })
            return NextResponse.json({ userData })
        
        case 'generate':
            const code = generateUniqueCode()
            const { data: user, error: createUserError } = await supabase
                .from("users")
                .insert({
                    referral_code: code,
                    address: address
                })
                .select()
                .single()
            
            if (createUserError) return NextResponse.json({ error: createUserError.message, status: 400 })


            const { data: referrer, error: referrerError } = await supabase
                .from("users")
                .select("*")
                .eq("referral_code", referralCode)
                .single()
            
            //if (referrerError) return NextResponse.json({ error: referrerError.message, status: 400 })
            
            if (referrer) {
                const { error: referralError } = await supabase
                    .from("referrals")
                    .insert({
                        referrer_id: referrer.id,
                        referred_id: user.id,
                        status: "COMPLETED"
                    })
                
                if (referralError) return NextResponse.json({ error: referralError.message, status: 400 })
                
                const { error: bonusError } = await supabase.rpc('increment_bonus_points', {
                    user_id: referrer.id,
                    points: 1
                })

                if (bonusError) return NextResponse.json({ error: bonusError.message, status: 400 })
            }
            return NextResponse.json({ success: true })
        // case 'verify':
        //     // Find referrer by code
        //     const { data: referrer, error: referrerError } = await supabase
        //         .from('users')
        //         .select()
        //         .eq('referral_code', referralCode)
        //         .single()

        //     if (referrerError) return NextResponse.json({ error: referrerError.message, status: 400 })

        //     if (referrer) {
        //         const { error: referralError } = await supabase
        //             .from('referrals')
        //             .insert({
        //                 referrer_id: referrer.id,
        //                 referred_id: userId,
        //                 status: 'PENDING'
        //             })

        //         if (referralError) return NextResponse.json({ error: referralError.message, status: 400 })
        //     }
        //     return NextResponse.json({ success: true })

        // case 'complete':
        //     // Find pending referral
        //     const { data: referral, error: referralError } = await supabase
        //         .from('referrals')
        //         .select()
        //         .eq('referred_id', userId)
        //         .eq('status', 'PENDING')
        //         .single()

        //     if (referralError) return NextResponse.json({ error: referralError.message })

        //     if (referral) {
        //         // Update referral status
        //         const { error: updateError } = await supabase
        //             .from('referrals')
        //             .update({ status: 'COMPLETED' })
        //             .eq('id', referral.id)

        //         if (updateError) return NextResponse.json({ error: updateError.message, status: 400 })

        //         // Award bonus points to referrer
        //         const { error: bonusError } = await supabase.rpc('increment_bonus_points', {
        //             user_id: referral.referrer_id,
        //             points: 1
        //         })

        //         if (bonusError) return NextResponse.json({ error: bonusError.message, status: 400 })
        //     }
        //     return NextResponse.json({ success: true })

        default:
            return NextResponse.json({ error: 'Invalid action', status: 400 })
    }
}
  