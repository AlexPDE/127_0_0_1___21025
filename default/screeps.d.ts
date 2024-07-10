declare global {
    interface CreepMemory {
        role:string;  
        state?:string;
        targetId?:string;
    }

    interface Memory {
        creeps: {[name:string]: CreepMemory};
        baseManager?:{
            roomName:{}
        };
    }
}
export{};