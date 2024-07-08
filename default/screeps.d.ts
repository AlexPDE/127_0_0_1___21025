declare global {
    interface CreepMemory {
        role:string;  
        state?:string;
    }

    interface Memory {
        creeps: {[name:string]: CreepMemory};
    }
}
export{};