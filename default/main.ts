import roleHarvester from "./role.harvester";
import baseManager from "./baseManager";
import initPrototypes from "./prototypesInit";
import roleUpgrader from "./role.upgrader";
import roleBuilder from "./role.builder";
import MemoryRole from "./memory.creep";
import roleMiner from "./role.miner";
import roleHauler from "./role.Hauler";
import diedCreepManager from "./diedCreepManagment";
import roleScout from "./role.scout";


export function loop():void{
    try {
        console.log(`-----------------------tick ${Game.time}-----------------------------------`)

        initPrototypes()
        for (let i in Game.flags){
            let flag = Game.flags[i]
            if(flag.memory.type == "source"){
                    flag.updateEnergySupplyFlag(flag)
            }
        }
        diedCreepManager()
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
            if(creep.memory.role == MemoryRole.SCOUT){
                roleScout.run(creep)
            }

            //testing Functions here--------------------------


        }
    } catch (error) {
        console.log(`mn loop ran into ${error}`)
    }
}