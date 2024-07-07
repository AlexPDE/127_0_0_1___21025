Flag.prototype.initialiseSourceFlag = function(baseFlag){
    pathToPickUp = this.pos.findPathTo(Game.flags[baseFlag],{range:1})
    pathToDelivery = Game.flags[baseFlag].pos.findPathTo(this,{range:1})
    pickUpPos = {
        "x":pathToPickUp[0].x,
        "y":pathToPickUp[0].y,
        "roomName":this.room.name,
    }
    deliveryPos = {
        "x":pathToDelivery[0].x,
        "y":pathToDelivery[0].y,
        "roomName":this.room.name,
    }

    TripsPerHauler = Math.floor (1500 / (2*pathToPickUp.length))
    
    this.memory = {
        energyManagment:{
            assignedMiners:{},
            miningSpeed:0,
            energyAvailable:0,
            energyPickUps:{},
            TripsPerHauler:TripsPerHauler,
            requiredHauler:0,
        },
        
        path:{
            distBase:pathToPickUp.length,
            pathToPickUp:pathToPickUp,
            pathToDelivery:pathToDelivery,
            pickUpPos:pickUpPos,
            deliveryPos:deliveryPos,
        },
        
    }
}

Flag.prototype.updateEnergy = function(){

}

Flag.prototype.addMiner = function(creepId){

}

Flag.prototype.removeMiner = function(creepId){
    
}

Flag.prototype.addEnergyPickUp = function(creepId){

}

Flag.prototype.removeEnergyPickUp = function(creepId){

}

Flag.prototype.requestSpawn = function(baseFlag,role){
    
}