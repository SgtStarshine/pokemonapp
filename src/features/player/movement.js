import store from '../../config/store'
import { SPRITE_SIZE, MAP_HEIGHT, MAP_WIDTH } from '../../config/constants'

export default function handleMovement(player) {

    function getNewPosition(oldPos, direction) {
        switch(direction) {
            case 'WEST':
                return [ oldPos[0]-SPRITE_SIZE, oldPos[1]]
                
            case 'EAST':
                return [ oldPos[0]+SPRITE_SIZE, oldPos[1]]
                
            case 'NORTH':
                return [ oldPos[0], oldPos[1]-SPRITE_SIZE]

            case 'SOUTH':
                return [ oldPos[0], oldPos[1]+SPRITE_SIZE]
        }
    }

    function getWalkIndex() {
        const walkIndex =store.getState().player.walkIndex
        return walkIndex >= 7 ? 0 : walkIndex + 1
    }

    function getSpriteLocation(direction, walkIndex) {
        switch(direction) {
            case 'SOUTH':
                return `${SPRITE_SIZE*0}px ${SPRITE_SIZE*walkIndex}px`
            case 'NORTH':
                return `${SPRITE_SIZE*7}px ${SPRITE_SIZE*walkIndex}px`
            case 'WEST':
                return `${SPRITE_SIZE*6}px ${SPRITE_SIZE*walkIndex}px`
            case 'EAST':
                return `${SPRITE_SIZE*4}px ${SPRITE_SIZE*walkIndex}px`            
            
        }
    }

    function observeBoundaries(oldPos, newPos) {
        return (newPos[0] >= 0 && newPos[0] <= MAP_WIDTH - SPRITE_SIZE) &&
               (newPos[1] >= 0 && newPos[1] <= MAP_HEIGHT - SPRITE_SIZE)
               ? newPos : oldPos
    }

    function observeImpassables(oldPos, newPos) {
        const tiles = store.getState().map.tiles
        const y = newPos[1] / SPRITE_SIZE
        const x = newPos[0] / SPRITE_SIZE
        const nextTile = tiles[y][x]
        return nextTile < 5
    }

    function dispatchMove(direction, newPos) {        
        const walkIndex = getWalkIndex()
        store.dispatch({
            type: 'MOVE_PLAYER',
            payload: {
                position: newPos,
                direction,
                walkIndex,
                spriteLocation: getSpriteLocation(direction, walkIndex)
            }
        })
    }

    function attemptMove(direction) {
        const oldPos = store.getState().player.position
        const newPos = getNewPosition(oldPos, direction)

        if (observeBoundaries(oldPos, newPos) && observeImpassables(oldPos, newPos))
            dispatchMove(direction, newPos)
    }

    function handleKeyDown(e) {
        e.preventDefault()

        switch(e.keyCode) {
            case 37:
                return attemptMove('WEST')
            case 38:
                return attemptMove('NORTH')
            case 39:
                return attemptMove('EAST')
            case 40:
                return attemptMove('SOUTH')
            default:
                console.log(e.keyCode)
        }
    }

    window.addEventListener('keydown', (e) => {
        handleKeyDown(e)
    })

    return player
}