import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
    const data = await req.json()
    const { action, fieldName, newValue, address } = data

    switch (action) {
        case 'sell':

            const { data: userDataSold, error: userErrorSold } = await supabase
                .from("users")
                .update({
                    [fieldName]: 0,
                    balance: newValue
                })
                .eq("address", address)
                .select()
                .single()

            if (userErrorSold) return NextResponse.json({ error: userErrorSold.message, status: 400 })
            return NextResponse.json({ userData: userDataSold })
        
        case 'improve':

            const { data: userData, error: userError } = await supabase
                .from("users")
                .select("*")
                .eq("address", address)
                .single()

            if (fieldName === "extraction_multiplier") {
                const { error } = await supabase
                    .from("users")
                    .update({ 
                        extraction_multiplier: userData.extraction_multiplier + 0.1,
                        balance: userData.balance - Math.floor(2**((userData.extraction_multiplier - 1) / 0.1)) * 1000
                    })
                    .eq("address", address)

                if (error) return NextResponse.json({ error: error.message, status: 400 })
                return NextResponse.json({ success: true })
            } else if (fieldName == "recovery_multiplier") {
                const { error } = await supabase
                    .from("users")
                    .update({ 
                        recovery_multiplier: userData.extraction_multiplier + 1,
                        balance: userData.balance - Math.floor(2**(userData.recovery_multiplier - 1))
                    })
                    .eq("address", address)

                if (error) return NextResponse.json({ error: error.message, status: 400 })
                return NextResponse.json({ success: true })
            }

            // if (userError) return NextResponse.json({ error: userError.message, status: 400 })
            // return NextResponse.json({ userData })
            // const code = generateUniqueCode()
            // const { data: user, error: createUserError } = await supabase
            //     .from("users")
            //     .insert({
            //         referral_code: code,
            //         address: address
            //     })
            //     .select()
            //     .single()
            
            // if (createUserError) return NextResponse.json({ error: createUserError.message, status: 400 })


            // const { data: referrer, error: referrerError } = await supabase
            //     .from("users")
            //     .select("*")
            //     .eq("referral_code", referralCode)
            //     .single()
            
            // //if (referrerError) return NextResponse.json({ error: referrerError.message, status: 400 })
            
            // if (referrer) {
            //     const { error: referralError } = await supabase
            //         .from("referrals")
            //         .insert({
            //             referrer_id: referrer.id,
            //             referred_id: user.id,
            //             status: "COMPLETED"
            //         })
                
            //     if (referralError) return NextResponse.json({ error: referralError.message, status: 400 })
                
            //     const { error: bonusError } = await supabase.rpc('increment_bonus_points', {
            //         user_id: referrer.id,
            //         points: 1
            //     })

            //     if (bonusError) return NextResponse.json({ error: bonusError.message, status: 400 })
            // }
            // return NextResponse.json({ success: true })

        default:
            return NextResponse.json({ error: 'Invalid action', status: 400 })
    }
}
  