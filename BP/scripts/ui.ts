import { ActionFormData } from '@minecraft/server-ui'
import { GAMEMODES, PLAYER_CLASSES } from './main'

export const VOTE = new ActionFormData()
    .title('ui.title.class_pvp:vote')
    .body('ui.body.class_pvp:vote')

export const CLASS = new ActionFormData()
    .title('ui.title.class_pvp:class_select')
// .body('ui.body.class_pvp:class_select')

export function init() {
    // Adds buttons to mode vote
    for (const name of Array.from(GAMEMODES.keys()))
        VOTE.button(`gamemode.class_pvp:${name}`)

    for (const name of Array.from(PLAYER_CLASSES.keys()))
        CLASS.button(`class.class_pvp:${name}`)
}