import bodyTypes, { typeHauler, typeMiner } from "./creepBodys"
import MemoryRole from "./memory.creep"
import roleMiner from "./role.miner"

let taskManager: {
    /**
     * @param {Creep} creep
     */
    addPotentialMiningTask(sourceId:Id<Source>, base:Room, sourceType:string ): void,
    enableMiningTask(sourceId:Id<Source>):void,
    scheduleMiningSubTasks():void,
    /**
     * @param {MemoryPrioSpawn} prio classes are the following low, medium, high
     */
    addSpawnTask(baseName:string, type:MemoryRole, inTicks:Number, addSize:number,prio:string, target:Id<Source>):void
    scheduleSpawn(room:Room):void,
    spawnFromTask(room:Room, spawnTask:MemorySpawnTask):void
    returnBodyForCreep(type:MemoryRole, numberAddBody:Number):any
}

export default taskManager = {

    addPotentialMiningTask(sourceId, base, sourceType){
        let source = Game.getObjectById(sourceId)
        let baseFlag = Game.flags[base.name]
        let distanceBase = 0
        if(source instanceof Source && baseFlag instanceof Flag){
            let path = source.pos.findPathTo(baseFlag)
            distanceBase = path.length
            let flagPos = new RoomPosition (path[0].x,path[0].y,base.name)
            flagPos.createFlag(source.id)
        }else{
            console.log(`error in addMiningTask was expecting to get a sourceId.`)
        }
        Memory.strategyManager.TasksManager.potentialMiningTask.push({
            sourceId: sourceId,
            base: base.name,
            distanceBase: distanceBase,
            taskExpectedEnergyCostRate:2,// to be calculate more exact later on. 
            sourceType:sourceType,
        })
    },

    enableMiningTask(sourceId){
        let potentialMiningtasks = Memory.strategyManager.TasksManager.potentialMiningTask
        for(let i = 0; potentialMiningtasks.length; i++){
            if(potentialMiningtasks[i].sourceId == sourceId){
                let miningTask = {
                    sourceId: sourceId,
                    base: potentialMiningtasks[i].base,
                    distanceBase: potentialMiningtasks[i].distanceBase,
                    hasContainer: false,
                    nextMinerSpawnTask: 0,
                    workPartsPresent:0,
                    assignedMiners:[],
                    incomingHaulers:[],
                    taskEnergyGainRate: 0,
                    taskEnergyCostRate:2,// needs to be calculated more accurately
                    taskSpawnCostMiner:0,// needs to be calculated more accurately
                    taskSpawnCostRepairer:0,// needs to be calculated more accurately
                    sourceType:potentialMiningtasks[i].sourceType
                }
                Memory.strategyManager.TasksManager.miningTasks.push(miningTask)
                Memory.strategyManager.TasksManager.potentialMiningTask.splice(i,1)
            }
        }
        
    },

    scheduleMiningSubTasks(){
        let tasks = Memory.strategyManager.TasksManager.miningTasks
        for(let i = 0; i < tasks.length; i++){
            if(tasks[i].nextMinerSpawnTask< 20){
                switch(tasks[i].sourceType){
                    case "base": 
                        taskManager.addSpawnTask(tasks[i].base,MemoryRole.MINER,tasks[i].nextMinerSpawnTask, 2,"medium",tasks[i].sourceId) // 5 for max five work parts on the body. Here needs to come some more logic on how many workParts can be build in order to schedule multiple suporting Miners. 
                }
            }
        }
    },

    addSpawnTask(baseName, type, inTicks, addSize, prio, target){
        Memory.strategyManager.roomManager[baseName].spawnTask[prio].push({
            type:type, 
            inTicks: inTicks, 
            addSize : addSize,
            targetSource: target
        })
    },

    scheduleSpawn(room){
        let spawnTaskAtPrio = Memory.strategyManager.roomManager[room.name].spawnTask
        let spawnPrios = ["high", `medium`, "low"]
        let spawnDefined = false
        for (let k of spawnPrios){
            for (let i = 0; i<spawnTaskAtPrio[k].length; i++){
                taskManager.spawnFromTask(room, spawnTaskAtPrio[k][i])
                spawnTaskAtPrio[k].splice(i,0)
            }
        }
    },

    spawnFromTask(room, spawnTask){
        let spawn = room.find(FIND_MY_SPAWNS)[0]
        let body = taskManager.returnBodyForCreep(spawnTask.type, spawnTask.addSize)
        let sourceId = spawnTask.targetSource
        if(sourceId){
            spawn.spawnCreep(body,spawnTask.type +Game.time,{memory:{
                role:spawnTask.type,
                base:room.name,
                targetId:sourceId,
                state: "justSpawned"
            }})
        }
    },

    returnBodyForCreep(type:MemoryRole, numberAddBody:number){
        let baseBody:BodyPartConstant[] = []
        let addBody:BodyPartConstant[] = []
        
        switch(type){
            case MemoryRole.MINER:
                    baseBody = typeMiner.baseBody
                    addBody = typeMiner.body
                    break;

                case MemoryRole.UPGRADER:
                case MemoryRole.BUILDER:
                case MemoryRole.MINER :
                case MemoryRole.HAULER:
                case MemoryRole.SCOUT:
                case MemoryRole.FASTFILLER:
                    break;
                default:
                    
            
        }
         
        let body = []
        for(let i = 0 ; i< baseBody.length;i++){
            body.push(baseBody[i])
        }

        for(let i = 0 ; i< numberAddBody;i++){
            for(let i = 0 ; i< addBody.length;i++){
                body.push(addBody[i])
            }
        }
        return body
    }   
}