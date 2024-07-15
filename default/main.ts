import baseManager from "./baseManager";
import initPrototypes from "./prototypesInit";
import roleUpgrader from "./role.upgrader";
import roleBuilder from "./role.builder";
import MemoryRole from "./memory.creep";
import roleMiner from "./role.miner";
import roleHauler from "./role.Hauler";
import diedCreepManager from "./diedCreepManagment";
import roleScout from "./role.scout";
import { calculateAverage, genericAnalyticsCalculations, startAnalytics } from "./analytics";
import { updateAllFlags } from "./flag.prototype";
import { forEach, keys } from "lodash"
import roleFastFiller from "./role.fastFiller";
import { addRequestForFastFiller } from "./spawnManager";
import bodyTypes from "./creepBodys";
import strategyManager from "./strategyManager";


export function loop():void{

    //addRequestForFastFiller(bodyTypes.MAXFASTFILLER,Game.rooms["W8N3"])
    console.log(`-----------------------tick ${Game.time}-----------------------------------`)
    if(!Memory.strategyManager){
        strategyManager.initiate()
    }
    
    startAnalytics()
    strategyManager.run()
    initPrototypes()
    //updateAllFlags()
    diedCreepManager()

    for (let i in Game.flags){
        let flag = Game.flags[i]
        if(flag.memory.type == "source"){
                //flag.updateEnergySupplyFlag(flag)
        }
    }
    //baseManager(Game.spawns["Spawn1"].room)
    
    for(var name in Game.creeps){
        var creep:Creep = Game.creeps[name]

        if(creep.memory.role == MemoryRole.UPGRADER){
            roleUpgrader.run(creep)
        }
        if(creep.memory.role == MemoryRole.FASTFILLER){
            roleFastFiller.run(creep)
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
    //setStrategy here every 10 ticks

    // if(Game.time%4 == 0){
    //     for (let i of keys(Game.flags)){
    //         Game.flags[i].remove()
    //         delete Memory.baseManager
    //     }
    // }

    


    //analytics
    //genericAnalyticsCalculations()
    let CPUBeforAnalytics = Game.cpu.getUsed()
    //calculateAverage()
    let CPUAfterAnalytics = Game.cpu.getUsed()
    console.log(`Game.cpu.getUsed(): ${Game.cpu.getUsed()}`)
}
