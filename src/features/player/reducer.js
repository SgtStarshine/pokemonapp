const initialState = {
    position: [32, 320],
    spriteLocation: '0px 0px',
    direction: 'east',
    walkIndex: 0,
}

const playerReducer = (state = initialState, action) => {
    switch(action.type){
        case 'MOVE_PLAYER':
            return {
                ...action.payload    
            }
        default:
        return state
    }
}

export default playerReducer