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
            RCL:number;
            sources:string[];
            energyRequests:string[];
            RecquestesSpawns:spawnRequestType[];
            strategy:string;
           };
        };
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
