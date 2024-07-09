let roleHarvester: {
    /**
     * @param {Creep} creep
     */
    run(creep: Creep): void
}

export default roleHarvester = {
    run(creep): void {
        try {
            switch(creep.memory.state){
                case `justSpawned`:
                    console.log("new creep just spawned")
                    creep.memory.state = "hasNoEnergy"
                    break;

                case `hasNoEnergy`:
                    creep.getEnergy(creep)
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
            console.log(`error in role.harvester`)
        }
    }
}

export let typeHarvester:creepType = {
    role:"harvester",
    body:[MOVE,WORK,CARRY],
    name:"Harvester" + Game.time,
    state:"justSpawned",
}
