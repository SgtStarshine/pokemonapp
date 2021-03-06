import React from 'react'
import { connect } from 'react-redux'
import { SPRITE_SIZE } from '../../config/constants'
import './map.css'


function getTileSprite(type) {
    switch(type) {
        case 0:
            return 'ground'
        case 1:
            return 'path'
        case 2:
            return 'grass'
        case 5:
            return 'barrier'
        case 6:
            return 'tree'
        case 7:
            return 'sign'
        case 8:
            return 'npc01'
        case 9:
            return 'npc02'
        case 11:
            return 'npc04'
        case 12:
            return 'npc05'
    }
}
function MapTile(props) {
    return <div 
    className={`tile ${getTileSprite(props.tile)}`}
    style={{
        height: SPRITE_SIZE,
        width: SPRITE_SIZE
    }}
    />
}

function MapRow(props) {
    return <div className='row'>
        {
            props.tiles.map( tile => <MapTile tile={tile} /> )
        }
    </div>
}

function Map(props) {
    return (
        <div
            style={{
                position: 'relative',
                top: '0px',
                left: '0px',
                width: '1280px',
                height: '640px'
            }}
        >

        {
            props.tiles.map( row => <MapRow tiles={row} /> )
        }

        </div>
    )
}

function mapStateToProps(state) {
    return {
        tiles: state.map.tiles,
    }
}

export default connect(mapStateToProps)(Map)