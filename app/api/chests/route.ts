import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

export async function GET() {

  try {
    
    const { data: results, error } = await supabase
        .from('treasure_chests')
        .select('*')
    if (error) throw error

    return NextResponse.json({ results })
  } catch (e) {
    console.error('Error getting chests:', e);
    return NextResponse.json({ error: "Failed getting chests", details: e instanceof Error ? e.message : String(e) }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {

    const { searchParams } = new URL(req.url)
    const cellId = parseInt(searchParams.get("cellId")!)

    const { error } = await supabase
      .from('treasure_chests')
      .delete()
      .eq("cell", cellId)

    if (error) {
      return NextResponse.json(
        { error: 'Failed to delete chest' },
        { status: 500 }
      )
    }
      
    return NextResponse.json(
      { message: `Chest ${cellId} deleted successfully` },
      { status: 200 }
    )

  } catch (e) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}