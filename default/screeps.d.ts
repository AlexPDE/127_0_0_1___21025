declare global {
    interface CreepMemory {
        role:string;  
        state?:string;
        targetId?:string;
        base?:string;
    }

    interface Memory {
        creeps: {[name:string]: CreepMemory};
        baseManager:{
           [key:string]:{
            sources:string[];
            energyRequests:string[];
            RecquestesSpawns:spawnRequestType[];
           };
        };
    }

    interface spawnRequestType{
        role:string
        body?:string[]
        target?:string
    }

    interface Base {
        energyAvailable: number;
        energyGainRate:number;
    }

}
export{};
