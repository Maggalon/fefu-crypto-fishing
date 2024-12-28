import { ChestCell } from "./types";

export class FishingGridGenerator {
    private static readonly FISHING_AREA = 1000000; // 1000x1000 = 1 million cells
  
    static async generateGrid() {
      // Create array of all cells with their content
      const cells: Partial<ChestCell>[] = [];
  
      // Generate grid
      for (let i = 0; i < 10; i++) {
        cells.push({
            cell: Math.floor(Math.random() * this.FISHING_AREA + 1),
            fefu: Math.floor(Math.random() * 250000 + 1),
        })
      }

      cells.push({
        cell: Math.floor(Math.random() * this.FISHING_AREA + 1),
        fefu: 1000000,
      })
  
      return cells;
    }
  }