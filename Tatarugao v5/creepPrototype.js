const miner = require("./miner")


Creep.prototype.getEnergyfromFlag = function(flagName){
    flag = Game.flags[flagName]
    miners = flag.memory.assignedMiner
    fullMiners = []
    groundEnergyMaxAmount = 0
    var groundEnergy
    for(i in miners){
        var creep = Game.getObjectById(i)
        if (creep == null){
            removeAssignedMiner(flagName, i)
        }else{
            try{
                if(creep.pos.lookFor(LOOK_ENERGY)[0].amount > groundEnergyMaxAmount){
                    groundEnergyMaxAmount = creep.pos.lookFor(LOOK_ENERGY)[0].amount
                    groundEnergy = creep.pos.lookFor(LOOK_ENERGY)[0]
                }
            }catch(error){
            }
        }
    }

    try {
        let result = this.pickup(groundEnergy)
        if (result == ERR_NOT_IN_RANGE){
            this.moveTo(groundEnergy)
        }
    } catch (error) {  }
    
    if(this.store.getFreeCapacity(RESOURCE_ENERGY) >= groundEnergyMaxAmount){
        try {
            Game.flags[flagName].pos.lookFor(LOOK_CREEPS)[0].transfer(this,RESOURCE_ENERGY)
        } catch (error) {}    
    }
    
    
    if(this.store.getFreeCapacity(RESOURCE_ENERGY)==0){
        if(Game.flags[this.memory.assignedBase].memory.hasStorage){
            console.log("code for delivery to storage")
        }else{
            if(Game.flags[this.memory.assignedBase].memory.hasContainer){
                console.log("code for delivery to container")
            }else{
                this.memory.state = "deliverToBase"
            }
        }
        delete Game.flags[this.memory.assignedFlag].memory.assignedPickups[this.id]
    }
}


Creep.prototype.deliverEnergyToBase = function(flagName){
    var target = Game.flags[flagName].room.find(FIND_MY_SPAWNS)[0]
    var result = this.transfer(target,RESOURCE_ENERGY)
    if (result == OK){
        this.memory.state.hasEnergy = false
    }
    if( result === ERR_NOT_IN_RANGE){
        this.moveTo(target)
    }
    if(result === ERR_INVALID_TARGET){
        this.memory.state = "deliverToController"
        this.memory.assignedFlag = target.room.controller.id
    }
    return result
}

Creep.prototype.deliverEnergyToBuilder = function(flagName){
    
    console.log("deliveringtoBuilder")
}

Creep.prototype.test = function(){
    console.log("test function for creep prototype is running")
}

Creep.prototype.getEnergyfromBase = function(flagName){
    target = Game.flags[flagName].room.find(FIND_MY_SPAWNS)[0]
    this.withdraw(target,RESOURCE_ENERGY)
}