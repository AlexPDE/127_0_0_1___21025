let spawnManager:Function

spawnManager = (room:Room) => {
    const fastFillers:Creep[] = _.filter(Game.creeps, (creep:Creep): boolean => creep.memory.role == MemoryRole.FASTFILLER)
    if(Memory.baseManager[room.name].fastFillerActive){
        
    }
}