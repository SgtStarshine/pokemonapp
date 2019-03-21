import React from 'react'
import { connect } from 'react-redux'
import playerSprite from './playerSprite.png'
import handleMovement from './movement'

function Player(props) {
    return (
        <div
            style={{
                position: 'absolute',
                top: props.position[1],
                left: props.position[0],
                backgroundImage: `url('${playerSprite}')`,
                backgroundPosition: props.spriteLocation,
                width: '32px',
                height: '32px'
            }}
        />
    )
}

function mapStateToProps(state) {
    return {
        ...state.player,
    }
}

export default connect(mapStateToProps)(handleMovement(Player))