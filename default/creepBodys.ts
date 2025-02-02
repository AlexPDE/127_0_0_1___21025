import MemoryRole from "./memory.creep"

export let typeScout:creepType = {
    role:"scout",
    baseBody:[MOVE],
    body:[],
    name:"scout",
    state:"justSpawned",
    max:0,
}

export let typeHauler:creepType = {
    role:"hauler",
    baseBody:[MOVE,CARRY],
    body:[MOVE,CARRY],
    name:"Hauler",
    state:"justSpawned",
    max:1,
}

export let typeBuilder:creepType = {
    role:"builder",
    baseBody:[MOVE,WORK,WORK,CARRY],
    body:[MOVE,WORK],
    name:"Builder ",
    state:"justSpawned",
    max:1,
}

export let typeUpgrader:creepType = {
    role:"upgrader",
    baseBody:[MOVE,WORK,CARRY],
    body:[WORK],
    name:"Upgrader",
    state:"justSpawned",
    max:1,
}

export let typeMiner:creepType = {
    role:"miner",
    baseBody:[MOVE],
    body:[WORK],
    name:"Miner",
    state:"justSpawned",
    max:3,
}

export let typeRemoteMiner:creepType = {
    role:"miner",
    baseBody:[MOVE,CARRY,WORK],
    body:[WORK],
    name:"Miner",
    state:"justSpawned",
    max:5,
}

export let typeFastfiller:creepType = {
    role: MemoryRole.FASTFILLER,
    baseBody:[MOVE,CARRY],
    body:[CARRY],
    name:"fastFiller",
    state:"justSpawned",
    max:1,
}

enum bodyTypes{
    MAXFASTFILLER = "maxFastFiller",
    MAXMINER = "maxMiner",

}


export default bodyTypes;


type creepType = {
    role:string,
    baseBody:BodyPartConstant[],
    body:BodyPartConstant[],
    name:string,
    state:string,
    max:number,
}