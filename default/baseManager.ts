import * as _ from "lodash"
import MemoryRole from "./memory.creep"
import {typeHarvester} from "./role.harvester";
import { typeUpgrader } from "./role.upgrader";
import { typeBuilder } from "./role.builder";

let baseManager: Function;

baseManager = (room:Room) =>{
    console.log(`base Manager is running`)
    const harvester:Creep[] = _.filter(Game.creeps, (creep:Creep): boolean => creep.memory.role == MemoryRole.HARVESTER)
    const upgrader:Creep[] = _.filter(Game.creeps, (creep:Creep): boolean => creep.memory.role == MemoryRole.UPGRADER)
    const builder:Creep[] = _.filter(Game.creeps, (creep:Creep): boolean => creep.memory.role == MemoryRole.BUILDER)


    let spawn:StructureSpawn = room.find(FIND_MY_SPAWNS)[0];
    if (harvester.length <4){
        console.log(`trying to spawn harvester currently ${harvester.length} exist`)
        spawn.spawnTypeCreep(spawn,typeHarvester)
    }else
    if (upgrader.length <3){
        console.log(`trying to spawn upgrader currently ${upgrader.length} exist`)
        spawn.spawnTypeCreep(spawn,typeUpgrader)
    }else
    if (builder.length <1){
        console.log(`trying to spawn upgrader currently ${builder.length} exist`)
        spawn.spawnTypeCreep(spawn,typeBuilder)
    }
};

export default baseManager
