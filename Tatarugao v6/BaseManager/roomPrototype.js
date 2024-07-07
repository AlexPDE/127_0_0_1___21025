var Flag = require('flagPrototype');


Room.prototype.initateSourcesRoom = function(baseFlag){
    console.log(this.name + " is beeing initated.")
    sources = this.find(FIND_SOURCES)
    for(sourceId in sources){
        pathStep = sources[sourceId].pos.findPathTo(Game.flags[baseFlag])
        let flagName = this.getPositionAt(pathStep[0].x, pathStep[0].y).createFlag(sources[sourceId].id, COLOR_CYAN)
        if(flagName != -3){
            let flag = Game.flags[flagName]
            flag.initialiseSourceFlag(baseFlag) 
        }
    }
}

Room.prototype.initiateBase = function(){
    baseName = this.find(FIND_MY_SPAWNS)[0].pos.createFlag(this.name,COLOR_BLUE)
    Game.flags[baseName].memory = {
        tasks:{
            pickUp: {},
            delivery: {},
        },
        sources:{},
        spawn:{
            energyRequired:0,
            energyDeliveris:[],
        },
        scoutTargets: [],
    }
    this.initateSourcesRoom(baseName)
}