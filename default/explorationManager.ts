let addRoomToExploration:Function
addRoomToExploration = (roomName:string,baseName:string) =>{
    let canMine = false
    let hostile = false
    let roomType = "unclear"
    let distance = 0
    if(Game.rooms[roomName].find(FIND_SOURCES)[0]){
        canMine = true
    }
    if(Game.rooms[roomName].find(FIND_HOSTILE_CREEPS)[0]){
        hostile=true
    }
    distance = Object.keys(Game.map.findRoute(baseName,roomName)).length
    if(canMine && !hostile && distance <=4){
            roomType = "potentialRemoteMine"
    }

    if(canMine && !hostile && distance >5){
        roomType = "distant"
    } 
    
    if(hostile){
        roomType = "hostile"
    }   

    Memory.baseManager[baseName].exploredRooms[roomName] = {
        distance:Object.keys(Game.map.findRoute(baseName,roomName)).length,
        roomType: roomType,
        
    }

}
export{addRoomToExploration}