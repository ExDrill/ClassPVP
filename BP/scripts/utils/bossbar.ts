import { world, Entity, Vector3 } from '@minecraft/server'

const pos: Vector3 = { x: 0, y: -60, z: 0 }

export function createBossbarEntity(): Entity {
    const entity = world.getDimension('overworld')
        .spawnEntity('class_pvp:round_timer', pos)

    return entity
}

export function getBossbarEntities(): Entity[] {
    const entities = world.getDimension('overworld').getEntities({
        type: 'class_pvp:round_timer'
    })

    if (entities.length >= 0)
        return entities
    return undefined
}

export function clearBossbars() {
    getBossbarEntities()?.forEach(
        entity => entity.triggerEvent('class_pvp:round_over'))
}