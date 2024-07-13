import { forEach } from "lodash"






export let initialiseAnalytics:Function = () =>{

    let analyticsEntryPreSet = {
        perTickCurrent: 0,
        past100Ticks: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        average10Ticks: 0,
        average100Ticks: 0,
    }

    Memory.analytics = {
        energyAvailable: analyticsEntryPreSet,
        energyGain: analyticsEntryPreSet,
        spawnTime: analyticsEntryPreSet,
        sinkBuild: analyticsEntryPreSet,
        sinkRepair: analyticsEntryPreSet,
        sinkSpawn: analyticsEntryPreSet,
        sinkUpgrading: analyticsEntryPreSet,
    }
}

export let addEnergyHarvested:Function = (amount:number) =>{
    Memory.analytics.energyGain.perTickCurrent = Memory.analytics.energyGain.perTickCurrent + amount
}

export let addSinkBuild:Function = (amount:number) =>{
    Memory.analytics.sinkBuild.perTickCurrent = Memory.analytics.sinkBuild.perTickCurrent + amount
}

export let startAnalytics:Function = () =>{
    let i:keyof typeof Memory.analytics
    for( i in Memory.analytics){
        Memory.analytics[i].perTickCurrent = 0
    }
}

export let saveHistory:Function = () =>{
    let i:keyof typeof Memory.analytics
    for( i in Memory.analytics){
        let k = Game.time%100
        Memory.analytics[i].past100Ticks[k] = Memory.analytics[i].perTickCurrent
        //Memory.analytics[i].past100Ticks[Game.time%100] = Memory.analytics[i]
    }
}


export let calculateAverage:Function = () =>{
    let i:keyof typeof Memory.analytics
    for(i in Memory.analytics){
        let sum100Average = 0
        let sum10Average = 0
        for (let k = 0 ; k<100; k++){
            sum100Average = Memory.analytics[i].past100Ticks[k] + sum100Average
            if(k < 10){
                let tickRemainder = Game.time%100
                if(tickRemainder-k >= 0 ){
                    sum10Average = Memory.analytics[i].past100Ticks[tickRemainder-k] + sum10Average
                }else{
                    sum10Average = Memory.analytics[i].past100Ticks[100-k] + sum10Average
                }
            }
        }
        Memory.analytics[i].average100Ticks = sum100Average/100
        Memory.analytics[i].average10Ticks = sum10Average/10
    }
}



