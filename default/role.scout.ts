let roleBuilder: {
    /**
     * @param {Creep} creep
     */
    run(creep: Creep): void
}


export let typeMiner:creepType = {
    role:"scout",
    baseBody:[MOVE],
    body:[],
    name:"scout",
    state:"justSpawned",
}
