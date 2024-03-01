import { world, system, EntityDieAfterEvent, EntityHealthChangedAfterEvent, PlayerInteractWithBlockAfterEvent, BlockComponentTypes, ChatSendBeforeEvent, ItemUseBeforeEvent, EntityComponentTypes, ItemStack, ItemLockMode } from '@minecraft/server'
import { setScore, addScore } from '../utils/scoreboard'
import { GAMEMODES, PLAYER_CLASSES } from '../main'
import * as UI from '../ui'
import Gamemode from '../modes/gamemode'
import { getTeamColor, TEAMS } from '../utils/teams'
import Command from '../commands/command'
import { refreshVoteBoard } from './lobby_events'

const classItems: string[] = [
    'minecraft:stone_sword',
    'minecraft:bow'
]

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

    addScore('class_pvp:eliminations', `team.class_pvp:${team}`, 1)
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

export function compassVote(event: ItemUseBeforeEvent): void {
    const player = event.source
    const itemId = event.itemStack.typeId

    if (itemId !== 'minecraft:compass') return
    event.cancel = true

    system.run(async () => {
        const result = await UI.VOTE.show(player)
        if (result.canceled) return

        const vote = Array.from(GAMEMODES.keys())[result.selection]
        player.setDynamicProperty('class_pvp:vote', vote)
        system.runTimeout(() => refreshVoteBoard(), 1)
    })
}

export function classSelect(event: ItemUseBeforeEvent): void {
    const player = event.source
    if (player.selectedSlot !== 1) return
    event.cancel = true

    system.run(async () => {
        const result = await UI.CLASS.show(player)
        if (result.canceled) return

        const idx = result.selection
        const className = Array.from(PLAYER_CLASSES.keys())[idx]
        player.setDynamicProperty('class_pvp:temp_class', className)

        const inventory = player.getComponent(EntityComponentTypes.Inventory)
        const stack = PLAYER_CLASSES.get(className).display.clone()
        stack.lockMode = ItemLockMode.slot
        inventory.container.setItem(1, stack)
    })
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