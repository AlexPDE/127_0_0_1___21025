let roleHauler: {
    /**
     * @param {Creep} creep
     */
    run(creep: Creep): void
}

export default roleHauler = {
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
                    break;

                default:
                    console.log(`creep ${creep} has the memory state ${creep.memory.state}, this is not defined`)
            }
        } catch (error) {
            console.log(`error in role.hauler`)
        }
    }
}

export let typeHauler:creepType = {
    role:"hauler",
    body:[MOVE,CARRY],
    name:"Hauler" + Game.time,
    state:"justSpawned",
}
