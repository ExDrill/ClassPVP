import { world, EntityDieAfterEvent, EntityHealthChangedAfterEvent, PlayerInteractWithBlockAfterEvent, BlockComponentTypes, system } from '@minecraft/server'
import { setScore } from '../utils/scoreboard'
import { gamemodes, propertyGamemodes } from '../main'
import Gamemode from '../modes/gamemode'

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
    if (killer) {
        world.scoreboard.getObjective('class_pvp:eliminations').addScore(killer, 1)
    }
}

export function rewardTeamScore(event: EntityDieAfterEvent): void {
    const killer = event.damageSource.damagingEntity
    if (!killer || killer.typeId !== 'minecraft:player') return

    const team = killer.getProperty('class_pvp:team') as string
    if (team === 'none') return

    world.scoreboard.getObjective('class_pvp:eliminations').addScore(team, 1)
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
    system.runTimeout(() => console.warn(player.getProperty('class_pvp:vote') as string), 1)
}