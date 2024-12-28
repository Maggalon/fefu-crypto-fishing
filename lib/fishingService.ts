import { supabase } from "./supabase";

export class FishingService {
    static async exploreCells(x: number, y: number, radius: number = 1) {
      const { data, error } = await supabase
        .from('fishing_grid')
        .select('*')
        .range(
          Math.max(0, x - radius),
          Math.min(999, x + radius)
        )
        .range(
          Math.max(0, y - radius),
          Math.min(999, y + radius)
        )
        .eq('discovered', false);
  
      if (error) throw error;
  
      // Mark cells as discovered
    //   if (data?.length) {
    //     const { error: updateError } = await supabase
    //       .from('fishing_grid')
    //       .update({ discovered: true })
    //       .in('id', data.map(cell => cell.id));
  
    //     if (updateError) throw updateError;
    //   }
  
      return data;
    }
  }