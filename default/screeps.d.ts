declare global {
    interface CreepMemory {
        role:string;  
        state?:string;
        targetId?:string;
    }

    interface Memory {
        creeps: {[name:string]: CreepMemory};
        baseManager:{
           [key:string]:{
            sources:string[];
            energyRequestsFlags:string[];
            RecquestesSpawns:spawnRequestType[];
           };
        };
    }

    interface spawnRequestType{
        role?:string
        body?:string[]
        target?:string
    }

    interface Base {
        energyAvailable: number;
        energyGainRate:number;
    }

    
}
export{};