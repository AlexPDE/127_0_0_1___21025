var Flag = require('flagPrototype');


// baseManager.js

module.exports = {
    body: [CARRY, MOVE],
    memory: {
        role: "hauler",
        state: "notAssigned"

    },
    manageBase: function(flag) { 
        //check if Hauler needs to be spanwed
        var creepUtils = require('creepUtils')
        
        // check all associated Scoouting flags

        if(!flag.memory.roomsToScout){
            exits = Game.map.describeExits(flag.room.name)
            memoryEntry = []
            for(i in exits){
                memoryEntry.push(exits[i])
            }
            flag.memory.roomsToScout = memoryEntry
        }
        

        

        // check energy availability at all mining locations that are enable.

        energyAtSources = 0
        energyGenerated = 0
        var activeMiningLocations = _.filter(Game.flags, flag => flag.color === COLOR_CYAN && flag.memory.miningEnable === true)
        for ( var i= 0; i<activeMiningLocations.length;i++){
            energyAtSource = activeMiningLocations[i].updateAvailableEnergy()
            energyAtSources += energyAtSource
             energyGenerated+= activeMiningLocations[i].memory.miningSpeed

        }
        flag.memory.generatedEnergy = energyGenerated





        var constructionFlags = _.filter(Game.flags, flag => flag.color === COLOR_BROWN)
        builderIsBeeingSpawned = false
        if(flag.memory.generatedEnergy >= flag.memory.prospectedEnergyOutput+10){
            if(constructionFlags[0]){
                builderCreeps = _.filter(Game.creeps, creep => creep.memory.role == "builder")
                buildingPower = 0
                for(i in builderCreeps){
                    workBodyAmount = builderCreeps[i].body.filter(i => i.type === WORK).length
                    buildingPower += 5*workBodyAmount
                }
                flag.memory.buildingPower = buildingPower
                for (var i = 0 ;  i < flag.memory.spawnRequest.length; i++){

                    if((flag.memory.spawnRequest[i].role == "builder")){
                        builderIsBeeingSpawned = true
                    }
                }
            }
        }

        if(flag.memory.targetBuildingPower > flag.memory.buildingPower && !builderIsBeeingSpawned){

            console.log("spawn a builder since more building pwer can be substained")
            flag.memory.spawnRequest.push({
                role: "builder",
                flag: flag.name
            })

        }


        // calculating the pick up Tasks
        miningLocations = flag.memory.miningLocation
        for ( var i= 0; i<miningLocations.length;i++){
            energyAtSource = Game.flags[miningLocations[i]].updateAvailableEnergy()   //
            var arrayId = flag.memory.pickUpTask.findIndex(element => element.flagName === miningLocations[i])
            if(arrayId == -1){
                flag.memory.pickUpTask.push({
                    type: "pickUpFromSource",
                    flagName: miningLocations[i],
                    amount: energyAtSource,
                })
            }else{
                flag.memory.pickUpTask[arrayId] = {
                    type: "pickUpFromSource",
                    flagName: miningLocations[i],
                    amount: energyAtSource,
                }
            }
            energyAtSources += energyAtSource
        }

        // check if base is full of energy.
        /*
        var energyBaseMissing = flag.room.energyCapacityAvailable - flag.room.energyAvailable
        try {

            
            memoryEntry = flag.memory.deliveryTasks[0]
            scheduledAmount = 0
            for (i in memoryEntry.scheduledDeliveries){
                scheduledAmount += memoryEntry.scheduledDeliveries[i]
            }
            flag.memory.deliveryTasks[0].amount = energyBaseMissing - scheduledAmount


            
        } catch (error) {
            flag.memory.deliveryTasks[0] = {
            type: "deliverToBase",
            amount: energyBaseMissing,
            flagName: flag.name,
            scheduledDeliveries: {}
            }
        }
        if(energyBaseMissing>0){
            flag.memory.deliveryTasks[0] = {
                type: "deliverToBase",
                amount: energyBaseMissing,
                flagName: flag.name,
            }
        }
        */
        // check if enough haulers are available.
        var amountHaulers = creepUtils.countCreepsByRole ("hauler")
        var amountMiner = creepUtils.countCreepsByRole ("miner")
        var requiredHaulerParts = 0
        for (i in flag.memory.haulerTaskList){
            requiredHaulerParts += flag.memory.haulerTaskList[i]
        }

        flag.memory.requiredHaulerParts = requiredHaulerParts

        if(flag.memory.requiredHaulerParts > amountHaulers || (amountHaulers==0 && amountMiner > 0)  ){
            var spawningHauler = true
            for (var i = 0 ;  i < flag.memory.spawnRequest.length; i++){

                if((flag.memory.spawnRequest[i].role == "hauler")){
                    spawningHauler = false
                }
            }
            if(spawningHauler){
                flag.memory.spawnRequest.push({
                    role: "hauler",
                    flag: flag.name
                })
            
            }
        }

        // if spawnRequest == 0 then check if new Mining Location can be added.
        if(flag.memory.spawnRequest == 0){
            var viableMiningLocations = _.filter(Game.flags, flag => flag.color === COLOR_CYAN && flag.memory.additionalMinerRequired === true)
            
            if(viableMiningLocations[0]!= undefined){
                var closestViableMiningLocations = viableMiningLocations.reduce((acc, curr) => curr.distanceToBase > acc.distanceToBase ? curr : acc, viableMiningLocations[0] || undefined);
                flag.memory.spawnRequest.push({
                    role: "miner",
                    flag: closestViableMiningLocations.name
                })
                newFlag = Game.flags[closestViableMiningLocations.name].pos.createFlag("container" + closestViableMiningLocations.name, COLOR_BROWN)
                if(newFlag){
                    try{Game.flags[newFlag].initialiseConstructionFlag(STRUCTURE_CONTAINER,flag.name )}catch(error){}

                }
            }else{
                if(flag.memory.targetScouts == 0){
                    flag.memory.targetScouts = 1
                }
            }

        }


        flag.assignHaulers()
//----------------------------------Logic to set up the base------------------------------------------------------
        var amountScouts = creepUtils.countCreepsByRole ("scout")
        if(amountScouts < flag.memory.targetScouts){
            requestRoleIfNotAlreadyRequested("scout",flag)
        }

        var amountUpgrader = creepUtils.countCreepsByRole ("upgrader")
        if(amountUpgrader < flag.memory.upgraderWorkParts){
            requestRoleIfNotAlreadyRequested("upgrader",flag)
        }

        if(!flag.memory.status){
            flag.memory.status = "initialEconomy"
        }

        switch(flag.memory.status){
            case "initialEconomy":
                if(flag.memory.generatedEnergy >= 30){
                    var pos = new RoomPosition(flag.pos.x+2, flag.pos.y, flag.room.name)
                    newFlag = pos.createFlag("initalSpawnContainer",COLOR_BROWN,COLOR_RED)
                    try{Game.flags[newFlag].initialiseConstructionFlag(STRUCTURE_CONTAINER,flag.name)}catch(error){console.log(error)}
                    flag.memory.targetBuildingPower = 20
                    flag.memory.status = "buildSpawnContainer" 
                }
            break;
            
            case "buildSpawnContainer":

                //flag.memory.status = "initialEconomy"
                //delete Game.flags["initalSpawnContainer"].memory
                //Game.flags["initalSpawnContainer"].remove()
                
            break;

            case "pushToContorllerLevel2":
            break;




            case "first buildings":
                flag.memory.targetBuildingPower = 10 // this needs to be dynamically adjusted
            break;

        }
        



        /*
        if(!flag.memory.freeHaulers[0]){
            spawningHauler = true
            for (var i = 0 ;  i < flag.memory.spawnRequest.length; i++){

                if((flag.memory.spawnRequest[i].role == "hauler") || (creepUtils.countCreepsByRole("miner") == 0)){
                    spawningHauler = false
                }
            }
        }
        
        if (spawningHauler){
            flag.memory.spawnRequest.unshift({
                role: "hauler",
                flag: flag.name,
            })    
        }

        energyAtSources = 0
        for ( var i= 0; i<flag.memory.miningLocation.length;i++){
            energyAtSource = Game.flags[flag.memory.miningLocation[i].flagName].updateAvailableEnergy()
            var arrayId = flag.memory.pickUpTask.findIndex(element => element.flagName === flag.memory.miningLocation[i].flagName)
            if(arrayId == -1){
                console.log("the flag is not yet in the hauler tasks")
                flag.memory.pickUpTask.push({
                    type: "pickUpFromSource",
                    flagName: flag.memory.miningLocation[i].flagName,
                    amount: energyAtSource,
                })
            }else{
                flag.memory.pickUpTask[arrayId] = {
                    type: "pickUpFromSource",
                    flagName: flag.memory.miningLocation[i].flagName,
                    amount: energyAtSource,
                }
            }
            energyAtSources += energyAtSource
        }
        if(!flag.memory.upgradeSpeed){
            flag.memory.upgradeSpeed = 1
            if(!flag.memory.deliveryTasks[0]){
                flag.memory.deliveryTasks = []
            }
            flag.memory.deliveryTasks.push({
                type: "deliverToController",
                flagName: flag.room.controller.id,
                amount: 0,
            })
        }else{
            var arrayId = flag.memory.deliveryTasks.findIndex(element => element.flagName === flag.room.controller.id)
            if(arrayId != -1){
                flag.memory.deliveryTasks[arrayId].amount += flag.memory.upgradeSpeed
            }else{
                flag.memory.deliveryTasks.push({
                    type: "deliverToController",
                    flagName: flag.room.controller.id,
                    amount: 0,
                })
            }
            
        }
        */

    }
}

function requestRoleIfNotAlreadyRequested(role, flag){
    var spawningRole = true
    for (var i = 0 ;  i < flag.memory.spawnRequest.length; i++){

        if((flag.memory.spawnRequest[i].role == role)){
            spawningRole = false
        }
    }
    if(spawningRole){
        flag.memory.spawnRequest.push({
            role: role,
            flag: flag.name,
        })
    
    }
}