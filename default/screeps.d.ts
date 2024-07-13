declare global {
    interface CreepMemory {
        role:string;  
        state?:string;
        targetId?:string;
        base:string;
        scoutRoom?:string,
    }

    interface Memory {
        creeps: {[name:string]: CreepMemory};
        baseManager:{
           [key:string]:{
            RCL:number;
            sources:string[];
            energyRequests:string[];
            RecquestesSpawns:spawnRequestType[];
            strategy:string;
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
    }
    
    interface analyticsEntry {
        perTickCurrent:number;
        past100Ticks:number[];
        average10Ticks:number;
        average100Ticks:number;
    }
    
    interface spawnRequestType{
        role:string;
        body?:string[];
        target?:string;
        maxSize:boolean;
    }

    interface Base {
        energyAvailable: number;
        energyGainRate:number;
    }

}
export{};
