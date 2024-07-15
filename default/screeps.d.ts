import MemoryRole from "./memory.creep";

declare global {
    interface CreepMemory {
        targetPos?:RoomPosition
        role:MemoryRole;  
        state?:string;
        targetId?:string;
        flagId?:string
        base:string;
        scoutRoom?:string,
    }
    interface MemoryStrategyManager {
        TasksManager:{
            potentialMiningTask:MemoryPotentialMiningTasks[],
            miningTasks: MemoryMiningTasks[],
            militaryTasks: string[],
            haulerTask:MemoryHaulerTask[],
            
        },
        explorationManager: {
            exploredRooms:[],
            priorityExploration:[],
            exploration:[],
        }  ,
        roomManager:{
            [key:string]:{
                buildTasks:string[],
                haulerTask:MemoryHaulerTask[],
                spawnTask:MemoryPrioSpawn,
            },
            
              
        }
    }

    interface MemoryMiningTasks {
        sourceId: Id<Source>,
        base: string,
        distanceBase: number,
        hasContainer: boolean,
        nextMinerSpawnTask: number,
        workPartsPresent:number,
        assignedMiners:string[],
        incomingHaulers:string[],
        taskEnergyGainRate?: number,
        taskEnergyCostRate:number,
        taskSpawnCostMiner?:number,
        taskSpawnCostRepairer?:number,
        sourceType:string,

    }

    interface MemoryPotentialMiningTasks {
        sourceId: Id<Source>,
        base: string,
        distanceBase: number,
        taskExpectedEnergyCostRate:number,
        sourceType:string,
    }

    interface MemoryMilitaryTask {
        
    }
    interface MemoryBuildTask {
        
    }
    interface MemoryHaulerTask {
        
    }
    interface MemoryPrioSpawn{
        [key:string]:MemorySpawnTask[]
    }
     
    interface MemorySpawnTask{

        type:MemoryRole, 
        inTicks: Number, 
        addSize : Number,
        targetSource?:Id<Source>,

    }
    interface Memory {
        strategyManager: MemoryStrategyManager;
        creeps: {[name:string]: CreepMemory};
        baseManager:{
           [key:string]:{
                RCL:number;
                fastFillerActive:boolean
                sources:string[];
                potentialSources:string[];
                energyRequests:string[];
                RecquestesSpawns:spawnRequestType[];
                strategy:string;
                imidiateGoal:string;
                exploredRooms:{
                    [key:string]:{
                        distance?:number
                        roomType?:string
                        testMemory?:any
                    }
                };
                unexploredRooms:{
                    [key:string]:{
                        distance?:number
                    }
                };
                
            };
        }
        analytics:analyticsMemory;
    }

    interface analyticsMemory {
        energyAvailable:analyticsEntry,
        energyGain:analyticsEntry,
        spawnTime:analyticsEntry,
        sinkBuild:analyticsEntry,
        sinkSpawn:analyticsEntry,
        sinkUpgrading:analyticsEntry,
        sinkRepair:analyticsEntry,
        CPUUsedPercentage:analyticsEntry,
    }
    
    interface analyticsEntry {
        perTickCurrent:number;
        past10Ticks:number[];
        past100Ticks:number[];
        past1000Ticks:number[];
        average10Ticks:number;
        average100Ticks:number;
        average1000Ticks:number;
    }
    
    interface spawnRequestType{
        role:MemoryRole;
        body:BodyPartConstant[];
        target?:string;
    }

    interface Base {
        energyAvailable: number;
        energyGainRate:number;
    }

}
export{};
