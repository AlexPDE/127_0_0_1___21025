let roleMiner: {
    /**
     * @param {Creep} creep
     */
    run(creep: Creep): void
}

export default roleMiner = {
    run(creep): void {
        try {
            switch(creep.memory.state){
                case `justSpawned`:
                    creep.memory.state = "hasNoEnergy"
                    break;

                case `hasNoEnergy`:
                    if(creep.memory.targetId){
                        var sourceId = creep.memory.targetId
                        creep.moveTo(Game.flags[sourceId].pos.x,Game.flags[sourceId].pos.y,)
                        if(creep.pos.isEqualTo(Game.flags[sourceId].pos)){
                            creep.memory.state = "mining"
                        }
                    }else{
                        console.log(`Miner has a targetId in  memory that is not defined`)
                    }
                    break;
                
                case `mining`:
                    if(creep.memory.targetId){
                        var sourceId = creep.memory.targetId
                        let source = Game.getObjectById(sourceId)
                        if(source instanceof Source){
                            creep.harvest(source)
                        }else{
                            console.log(`miner trys to havest something that i snot a source`)
                        }
                        

                       
                        
                    }
                    break;

                case `hasEnergy`:
                    let spawn = creep.room.find(FIND_MY_SPAWNS)[0]
                    if(creep.transfer(spawn,RESOURCE_ENERGY,creep.store.getUsedCapacity(RESOURCE_ENERGY)) === ERR_NOT_IN_RANGE){
                        creep.moveTo(spawn)
                    }
                    if(creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0){
                        creep.memory.state = "hasNoEnergy"
                    }
                    break;

                default:
                    console.log(`creep ${creep} has the memory state ${creep.memory.state}, this is not defined`)
            }
        } catch (error) {
            console.log(`error in role.miner`)
        }
    }
}

    
export let typeMiner:creepType = {
    role:"miner",
    body:[MOVE,WORK,WORK],
    name:"Miner" + Game.time,
    state:"justSpawned",
}
