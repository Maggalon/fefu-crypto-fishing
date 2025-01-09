import { useState, useEffect, useCallback, useMemo, useContext } from 'react';
import { BaitSystem } from '../lib/baitSystem';
import { HexGrid, Layout, Hexagon, GridGenerator, Hex } from 'react-hexgrid';
import { Modal } from './modal';
import { CellContent, ChestCell } from '@/lib/types';
import Link from 'next/link';
import { WalletMinimal } from 'lucide-react';
import { MainContext } from '@/context/main-context';
import { GridLoader } from 'react-spinners';

interface BaitDisplayProps {
  maxBait?: number;
  recoveryRate?: number;
  recoveryInterval?: number;
  onBaitUpdate?: (bait: number) => void;
}

interface HexagonObject {
  id: number;
  item: Hex;
  isActive: boolean;
  content: CellContent
}

export default function BaitDisplay({
  maxBait=10,
  recoveryRate=1,
  recoveryInterval=1800000,
  onBaitUpdate
}: BaitDisplayProps) {

    const context = useContext(MainContext);
    const currentUser = context?.currentUser;
    const setCurrentUser = context?.handleSetCurrentUser;
    const getCurrentUser = context?.getCurrentUser;

    const [bait, setBait] = useState<number>(0);
    const [timeUntilNext, setTimeUntilNext] = useState<number>(0);
    const [grid, setGrid] = useState<HexagonObject[]>([])
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [curCellContent, setCurCellContent] = useState<CellContent>({fish: 0, squid: 0, pearl: 0, treasure: 0})

    const [isLoading, setIsLoading] = useState<boolean>(false)

    const baitSystem = useMemo(() => new BaitSystem({
      maxBait,
      recoveryRate,
      recoveryInterval
    }), [maxBait, recoveryRate, recoveryInterval]);
  
    const updateBait = useCallback(() => {
      const currentBait = baitSystem.getCurrentBait();
      const nextPointTime = baitSystem.getTimeUntilNextPoint();
      
      setBait(currentBait);
      setTimeUntilNext(nextPointTime);
      onBaitUpdate?.(currentBait);
    }, [baitSystem, onBaitUpdate]);
  
    useEffect(() => {
      updateBait();
      const interval = setInterval(updateBait, 1000);
      return () => clearInterval(interval);
    }, [updateBait]);

    useEffect(() => {
        generateGrid()
    }, [])
  
    const handleUseBait = async (cost: number, cellId: number, chestId: number) => {
      const success = baitSystem.useBait(cost);
      if (success) {
        updateBait();

        const tempGrid = [...grid]
        tempGrid[cellId].isActive = false
        setGrid(tempGrid)

        await fetch(`/api/chests?cellId=${chestId}`, { method: "DELETE" })
        
        //const userData = JSON.parse(sessionStorage.getItem("user")!)
        const response = await fetch("/api/users", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: currentUser!.id,
                content: tempGrid[cellId].content
            })
        })
        
        setCurrentUser!(currentUser!.address)
      }
      
    };

    const handleClose = () => {
        setOpenModal(false);
    };

    const handleOpen = () => {
        setOpenModal(true);
    };

    const generateCellContent = () => {
        const content: CellContent = {
            fish: Math.random() > 0.3 ? Math.floor((Math.random() * 20 + 1) * currentUser!.extraction_multiplier) : 0,
            squid: Math.random() > 0.5 ? Math.floor((Math.random() * 10 + 1) * currentUser!.extraction_multiplier) : 0,
            pearl: Math.random() > 0.8 ? Math.floor((Math.random() * 3 + 1) * currentUser!.extraction_multiplier) : 0,
            treasure: 0
        }

        return content
    }

    const generateGrid = async () => {
        setIsLoading(true)

        const response = await fetch(`/api/chests`)
        const data = await response.json()        

        const rawGrid = GridGenerator.hexagon(7);  
        const newGrid: HexagonObject[] = []
        
        for await (const item of rawGrid) {
            const id = Math.floor(Math.random() * 1000000 + 1)
            const chest: ChestCell = data.results.find((item: ChestCell) => item.cell == id)
            
            const content: CellContent = generateCellContent()
            newGrid.push({
                id: id, 
                item: item, 
                isActive: true, 
                content: chest ? {...content, treasure: chest.fefu} : {...content}
            })
        }

        setGrid(newGrid)

        setIsLoading(false)
    }

    // const handleClick = async () => {
    
    //   try {
    //     // Generate grid cells
    //     const cells = await FishingGridGenerator.generateGrid();
    
    //     const { error } = await supabase
    //     .from('treasure_chests')
    //     .insert(cells);
    
    //     if (error) throw error;
    
    //     console.log('Grid initialized successfully');
    //   } catch (error) {
    //     console.error('Error initializing grid:', error);
    //   }
    // }

    if (!currentUser) {
        return (
            <div className='w-full mt-10 max-w-lg flex flex-col gap-5 justify-center items-center text-white'>
                <div>Подключи кошелек, чтобы начать рыбалку</div>
                <Link href="/profile">
                    <button className='flex items-center gap-2 bg-[#2980b9] p-2 rounded-lg'><WalletMinimal />Подключить</button>
                </Link>
            </div>
        )
    }
  
    return (
        <div className='flex flex-col w-full max-w-lg justify-center items-center gap-10 mt-10'>
            <GridLoader color='white' loading={isLoading} size={30} />
            <HexGrid width={"100%"} height={"100%"}>
                <Layout size={{ x: 3, y: 3 }} spacing={1.3}>
                    { grid.map(({ id, item, isActive, content }, i) => {
                        return (
                            <Hexagon key={i} 
                                    onClick={() => {
                                        if (isActive && bait > 0) {
                                            handleUseBait(1, i, id)
                                            setCurCellContent(content)
                                            handleOpen()
                                        }
                                    }} 
                                    className={`${isActive ? 'fill-white/70 hover:fill-white' : 'fill-white/30'}`} 
                                    q={item.q} r={item.r} s={item.s} /> )})}
                </Layout>
            </HexGrid>
            <div className="w-full max-w-lg flex justify-center gap-2 items-center bg-white/10 rounded-full shadow-2xl p-3">
                <div className="text-sm text-white tracking-wide">НАЖИВКА</div>
                <div className="w-full border-2 rounded-full h-3">
                    <div className="bg-white/80 h-full rounded-full" style={{ width: `${bait/maxBait*100}%` }}></div>
                </div>
                <div className="text-white text-sm flex gap-1">
                    <div>{bait}/{maxBait}</div> 
                    {timeUntilNext > 0 && bait < maxBait && <div>({Math.floor(timeUntilNext / 60000)}:{Math.floor(timeUntilNext % 60000 / 1000)})</div> }
                </div>
            </div>
            {/* <button className='bg-white mt-4' onClick={handleClick}>Generate grid</button> */}
            <Modal isOpen={openModal} onClose={handleClose}>
                <div className='w-full flex flex-col justify-center items-center bg-[#2980b9] text-white rounded-lg p-4'>
                    {curCellContent!.fish > 0 && <div>Рыба: {curCellContent!.fish}</div>}
                    {curCellContent!.squid > 0 && <div>Кальмар: {curCellContent!.squid}</div>}
                    {curCellContent!.pearl > 0 && <div>Жемчужина: {curCellContent!.pearl}</div>}
                    {curCellContent!.treasure > 0 && <div>Сундук с сокровищем, содержащий {curCellContent!.treasure} FEFU</div>}
                    {curCellContent!.fish == 0 && 
                    curCellContent!.squid == 0 &&
                    curCellContent!.pearl == 0 &&
                    curCellContent!.treasure == 0 && <div>Пусто</div>}              
                </div>
            </Modal>
        </div>
    );
}