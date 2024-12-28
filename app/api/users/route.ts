import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';
import { CellContent } from '@/lib/types';

export async function GET(req: NextRequest) {

  try {
    const { searchParams } = new URL(req.url)
    const address = searchParams.get("address")
    const { data: results, error } = await supabase
        .from('users')
        .select('*')
        .eq("address", address)
    if (error) throw error

    return NextResponse.json({ results })
  } catch (e) {
    console.error('Error getting user:', e);
    return NextResponse.json({ error: "Failed getting user", details: e instanceof Error ? e.message : String(e) }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { user_id, content } = body

        const { data: fish_res, error: fish_error } = await supabase.rpc('increment_fish', {
            user_id: user_id,
            catched_fish: content.fish
        })
        if (fish_error) {
            return NextResponse.json(
                { error: fish_error }
            )
        }

        const { data: squid_res, error: squid_error } = await supabase.rpc('increment_squid', {
            user_id: user_id,
            catched_squid: content.squid
        })
        if (squid_error) {
            return NextResponse.json(
                { error: squid_error }
            )
        }

        const { data: pearl_res, error: pearl_error } = await supabase.rpc('increment_pearl', {
            user_id: user_id,
            catched_pearl: content.pearl
        })
        if (pearl_error) {
            return NextResponse.json(
                { error: pearl_error }
            )
        }

        return NextResponse.json({ status: 200, message: "Successfully updated storage" })
    } catch (e) {
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}