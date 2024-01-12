import { world, system, Vector, Vector3, BlockTypes } from '@minecraft/server'
import makeNoise2D from './perlinNoise'

const dimension = world.getDimension('overworld')
const noise = makeNoise2D(200)
const noiseSettings: NoiseSettings = {
    scale: {
        x: 0.015,
        z: 0.015
    }
}

system.beforeEvents.watchdogTerminate.subscribe(event => {
    event.cancel = true
})

world.afterEvents.chatSend.subscribe(event => {
    const msg = event.message
    const sender = event.sender
    if (msg != 'gen') return

    generateChunk(sender.location)
})

function generateChunk(origin: Vector3) {
    let delay = 0

    for (let x = 0; x <= 16; x++) {
        for (let y = 0; y <= 64; y++) {
            for (let z = 0; z <= 16; z++) {
                system.runTimeout(() => {
                    const pos = Vector.add(origin, { x, y, z })

                    const block = getBlockAt(pos)
                    dimension.getBlock(pos).setType(block)
                }, delay)
            }
        }
    }
}

function sampleNoise(x: number, z: number, settings: NoiseSettings = noiseSettings) {
    return noise(x * settings.scale.x, z * settings.scale.z)
}

function getBlockAt(pos: Vector3) {
    const surfaceY = 15 + Math.round(sampleNoise(pos.x, pos.z) * 10)

    if (pos.y > surfaceY) {
        return 'minecraft:air'
    }
    else if (pos.y == surfaceY) {
        return 'minecraft:grass'
    }
    else if (pos.y > surfaceY - 5) {
        return 'minecraft:dirt'
    }
    return 'minecraft:stone'
}

type NoiseSettings = {
    scale: NoiseScale
}

type NoiseScale = {
    x: number,
    z: number
}