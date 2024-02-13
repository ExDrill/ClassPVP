import { world, system, EntityDieAfterEvent, EntityHealthChangedAfterEvent, PlayerInteractWithBlockAfterEvent, BlockComponentTypes, ChatSendBeforeEvent, ItemUseAfterEvent, EntityComponentTypes } from '@minecraft/server'
import { setScore, addScore } from '../utils/scoreboard'
import { GAMEMODES, PLAYER_CLASSES } from '../main'
import * as UI from '../ui'
import Gamemode from '../modes/gamemode'
import { getTeamColor, TEAMS } from '../utils/teams'
import Command from '../commands/command'
import { equalStacks } from '../utils/helper'

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

    addScore('class_pvp:eliminations', TEAMS[team] + team, 1)
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

    if (!GAMEMODES.has(text)) return
    player.setDynamicProperty('class_pvp:vote', text)
}

export async function compassVote(event: ItemUseAfterEvent): Promise<void> {
    const player = event.source
    const itemId = event.itemStack.typeId

    if (itemId !== 'minecraft:compass') return

    const result = await UI.VOTE.show(player)
    if (result.canceled) return

    const vote = Array.from(GAMEMODES.keys())[result.selection]
    player.setDynamicProperty('class_pvp:vote', vote)
}

export async function classSelect(event: ItemUseAfterEvent): Promise<void> {
    const player = event.source
    const stack = event.itemStack

    const inventory = player.getComponent(EntityComponentTypes.Inventory)
    const stackTwo = inventory.container.getItem(1)
    if (!equalStacks(stack, stackTwo)) return

    const result = await UI.CLASS.show(player)
    if (result.canceled) return

    const chosenClass = Array.from(PLAYER_CLASSES.keys())[result.selection]
    player.setProperty('class_pvp:player_class', chosenClass)
    system.runTimeout(() => player.sendMessage(player.getProperty('class_pvp:player_class') as string), 1)
}

export function chatColor(event: ChatSendBeforeEvent): void {
    const player = event.sender
    const name = player.name
    const color = getTeamColor(player)
    const message = event.message

    if (Command.getCommand(message)) return
    event.cancel = true

    world.sendMessage(`${color}<${name}>§r ${message}`)
}