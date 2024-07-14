import { exit } from "process"
import { addRoomToExploration } from "./explorationManager"
import { addSourceFlagsForRoom } from "./baseManager"

let roleScout: {
    /**
     * @param {Creep} creep
     */
    run(creep: Creep): void
}


export default roleScout = {
    run(creep):void {
        if(creep.memory.scoutRoom){
            let targetPos = new RoomPosition(25,25,creep.memory.scoutRoom)
            creep.moveTo(targetPos)
            if(creep.pos.inRangeTo(targetPos,24)){    
                addRoomToExploration(creep.memory.scoutRoom, creep.memory.base)
                addSourceFlagsForRoom(creep.room, Game.rooms[creep.memory.base],false)
                delete creep.memory.scoutRoom
            }
        }else{
            let exits = Game.map.describeExits(creep.room.name)
            let searchRoom = true
            let targetPos:RoomPosition
            let knownRoom = Memory.baseManager[creep.memory.base].exploredRooms
            


            if(exits[1] && !(exits[1] in knownRoom)){
                let roomName = exits[1]
                if(searchRoom){
                    creep.memory.scoutRoom = roomName
                }else{
                    Memory.baseManager[creep.memory.base].unexploredRooms[roomName] = {distance: Object.keys(Game.map.findRoute(roomName,creep.memory.base)).length}
                }
                searchRoom = false   
            }
            if(exits[3] && !(exits[3] in knownRoom)){
                let roomName = exits[3]
                if(searchRoom){
                    creep.memory.scoutRoom = roomName
                }else{
                    Memory.baseManager[creep.memory.base].unexploredRooms[roomName] = {distance: Object.keys(Game.map.findRoute(roomName,creep.memory.base)).length}
                }
                searchRoom = false   
            }
            if(exits[5] && !(exits[5] in knownRoom)){
                let roomName = exits[5]
                if(searchRoom){
                    creep.memory.scoutRoom = roomName
                }else{
                    Memory.baseManager[creep.memory.base].unexploredRooms[roomName] = {distance: Object.keys(Game.map.findRoute(roomName,creep.memory.base)).length}
                }
                searchRoom = false   
            }
            if(exits[7] && !(exits[7] in knownRoom)){
                let roomName = exits[7]
                if(searchRoom){
                    creep.memory.scoutRoom = roomName
                }else{
                    Memory.baseManager[creep.memory.base].unexploredRooms[roomName] = {distance: Object.keys(Game.map.findRoute(roomName,creep.memory.base)).length}
                }

                searchRoom = false   
            }


            if(searchRoom == true){
                for(let i in Memory.baseManager[creep.memory.base].unexploredRooms){
                }
            }
        }

    },
}


