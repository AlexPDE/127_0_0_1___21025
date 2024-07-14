import { forEach, keys } from "lodash"



export let initialiseAnalytics:Function = () =>{

    let analyticsEntryPreSet = {
        perTickCurrent: 0,
        past10Ticks: [0,0,0,0,0,0,0,0,0,0],
        past100Ticks: [0,0,0,0,0,0,0,0,0,0],
        past1000Ticks: [0,0,0,0,0,0,0,0,0,0],
        average10Ticks: 0,
        average100Ticks: 0,
        average1000Ticks: 0,
    }


    Memory.analytics = {
        energyAvailable: analyticsEntryPreSet,
        energyGain: analyticsEntryPreSet,
        spawnTime: analyticsEntryPreSet,
        sinkBuild: analyticsEntryPreSet,
        sinkRepair: analyticsEntryPreSet,
        sinkSpawn: analyticsEntryPreSet,
        sinkUpgrading: analyticsEntryPreSet,
        CPUUsedPercentage:analyticsEntryPreSet
    }
}

export let addEnergyHarvested:Function = (amount:number) =>{
    Memory.analytics.energyGain.perTickCurrent = Memory.analytics.energyGain.perTickCurrent + amount
}

export let genericAnalyticsCalculations:Function = () =>{
    Memory.analytics.CPUUsedPercentage.perTickCurrent = Game.cpu.getUsed()/Game.cpu.limit
    let spawnsNumb = 0
    let spansSpawning = 0
    for(let j of keys(Game.spawns)){
        if(Game.spawns[j].spawning){spansSpawning++}
        spawnsNumb++
    }

    Memory.analytics.spawnTime.perTickCurrent = spansSpawning/spawnsNumb

}


export let addSinkBuild:Function = (amount:number) =>{
    Memory.analytics.sinkBuild.perTickCurrent = Memory.analytics.sinkBuild.perTickCurrent + amount
}

export let addSinkUpgrading:Function = (amount:number) =>{
    Memory.analytics.sinkUpgrading.perTickCurrent = Memory.analytics.sinkUpgrading.perTickCurrent + amount
}

export let startAnalytics:Function = () =>{
    let i:keyof typeof Memory.analytics
    for( i in Memory.analytics){
        Memory.analytics[i].perTickCurrent = 0
    }
}



export let calculateAverage:Function = () =>{
    try {
        let i:keyof typeof Memory.analytics
        for(i in Memory.analytics){
            let arrayNum = Game.time %10
            let calculateSum100 = false
            let calculateSum1000 = false
            if(Game.time%10 == 0){
                calculateSum100 = true
            }
            if(Game.time%100 == 0){
                calculateSum1000 = true
            }

            let sum10Average = 0
            let sum100Average = 0
            let sum1000Average = 0
            Memory.analytics[i].past10Ticks[arrayNum] = Memory.analytics[i].perTickCurrent
            for (let k = 0 ; k<10; k++){
                sum10Average = Memory.analytics[i].past10Ticks[k] + sum10Average
            }
            Memory.analytics[i].average10Ticks = sum10Average/10
            if(calculateSum100){
                Memory.analytics[i].past100Ticks[Game.time%100/10] = Memory.analytics[i].average10Ticks
                for (let k = 0 ; k<10; k++){  
                    sum100Average = Memory.analytics[i].past100Ticks[k] + sum100Average
                }
                Memory.analytics[i].average100Ticks = sum100Average/10
            }
            if(calculateSum1000){
                Memory.analytics[i].past1000Ticks[Game.time%1000/100] = Memory.analytics[i].average100Ticks
                for (let k = 0 ; k<10; k++){
                    sum100Average = Memory.analytics[i].past1000Ticks[k] + sum1000Average
                }
                Memory.analytics[i].average1000Ticks = sum1000Average/10
            }
        }
            
    } catch (error) {
        console.log("error in calculate averages")
    }
}



