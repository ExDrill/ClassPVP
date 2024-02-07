import { world, Entity, Vector3 } from '@minecraft/server'

const bossbarTag = 'class_pvp:bossbar'
const armorStandPosition: Vector3 = { x: 0, y: 0, z: 0 }

export function createBossbarEntity(): Entity {
    const overworld = world.getDimension('overworld')
    const entity = overworld
        .spawnEntity('minecraft:armor_stand', armorStandPosition)

    entity.teleport(armorStandPosition)
    entity.addTag(bossbarTag)

    return entity
}

export function getBossbarEntity(): Entity {
    const entities = world.getDimension('overworld').getEntities({
        tags: [bossbarTag]
    })

    if (entities.length >= 0)
        return entities[0]
    return undefined
}