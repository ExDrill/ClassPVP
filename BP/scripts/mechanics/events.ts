import { world, EntityDieAfterEvent, EntityHealthChangedAfterEvent, PlayerInteractWithBlockAfterEvent, BlockComponentTypes, system, ChatSendBeforeEvent } from '@minecraft/server'
import { setScore, addScore } from '../utils/scoreboard'
import { gamemodes, propertyGamemodes } from '../main'
import Gamemode from '../modes/gamemode'
import { getTeamColor, teams } from '../utils/teams'

export function healthOnKill(event: EntityDieAfterEvent): void {
    const damageSource = event.damageSource
    const killer = damageSource.damagingEntity

    if (!killer) return

    killer.addEffect('instant_health', 1, {
        amplifier: 0,
        showParticles: true
    })
}

export function rewardScore(event: EntityDieAfterEvent): void {
    const damageSource = event.damageSource
    const killer = damageSource.damagingEntity
    if (killer)
        addScore('class_pvp:eliminations', killer, 1)
}

export function rewardTeamScore(event: EntityDieAfterEvent): void {
    const killer = event.damageSource.damagingEntity
    if (!killer || killer.typeId !== 'minecraft:player') return

    const team = killer.getProperty('class_pvp:team') as string
    if (team === 'none') return

    addScore('class_pvp:eliminations', teams[team] + team, 1)
}

export function healthDisplay(event: EntityHealthChangedAfterEvent): void {
    const entity = event.entity;
    const health = event.newValue;

    if (entity.typeId !== 'minecraft:player') return
    setScore('class_pvp:health', entity, health)
}

export function signVote(event: PlayerInteractWithBlockAfterEvent): void {
    const player = event.player
    const block = event.block
    const sign = block.getComponent(BlockComponentTypes.Sign)
    if (!sign || !sign.isWaxed) return

    const text = sign.getText()
    const gamemode: Gamemode = gamemodes[text]
    if (!gamemode) return

    player.setProperty('class_pvp:vote', propertyGamemodes[text])
}

export function chatColor(event: ChatSendBeforeEvent): void {
    event.cancel = true

    const player = event.sender
    const name = player.name
    const color = getTeamColor(player)
    const message = event.message

    world.sendMessage(`${color}<${name}>§r ${message}`)
}