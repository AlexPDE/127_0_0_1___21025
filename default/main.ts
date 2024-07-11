import roleHarvester from "./role.harvester";
import baseManager from "./baseManager";
import initPrototypes from "./prototypesInit";
import roleUpgrader from "./role.upgrader";
import roleBuilder from "./role.builder";
import MemoryRole from "./memory.creep";
import roleMiner from "./role.miner";
import roleHauler from "./role.Hauler";


export function loop():void{
    try {
        initPrototypes()
        console.log(`-----------------------tick ${Game.time}-----------------------------------`)
        baseManager(Game.spawns["Spawn1"].room)
        for(var name in Game.creeps){
            var creep:Creep = Game.creeps[name]
            if(creep.memory.role == MemoryRole.HARVESTER){
                roleHarvester.run(creep)
            }
            if(creep.memory.role == MemoryRole.UPGRADER){
                roleUpgrader.run(creep)
            }
            if(creep.memory.role == MemoryRole.BUILDER){
                roleBuilder.run(creep)
            }
            if(creep.memory.role == MemoryRole.MINER){
                roleMiner.run(creep)
            }
            if(creep.memory.role == MemoryRole.HAULER){
                roleHauler.run(creep)
            }

            //testing Functions here--------------------------


        }
    } catch (error) {
        console.log(`${error}`)
    }
}