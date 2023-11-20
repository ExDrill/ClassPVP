import { Player, Vector3 } from '@minecraft/server';
import { chatColor, Color, tagFromColor } from './gamemode/colors'

export default class Team {
    public color: Color;
    public players: Player[];
    public startPos: Vector3;

    public constructor(color: Color, players: Player[], startPos: Vector3) {
        this.color = color;
        this.players = players;
        this.startPos = startPos;
    }

    public start() {
        for (const player of this.players) {
            player.removeTag('class_pvp:ready');
            if (player.hasTag('class_pvp:eliminated'))
                player.removeTag('class_pvp:eliminated');

            player.addTag(tagFromColor(this.color));

            player.setSpawnPoint({
                dimension: this.players[0].dimension,
                x: this.startPos.x,
                y: this.startPos.y,
                z: this.startPos.z
            });
            player.teleport(player.getSpawnPoint());
            player.nameTag = `§${chatColor(this.color)}${player.name}§r`;
        }

        this.players[0]?.dimension.runCommand(`title @a[tag=${tagFromColor(this.color)}] title §aSTART`);
        this.players[0]?.dimension.runCommand(`title @a[tag=${tagFromColor(this.color)}] actionbar You are on the §${chatColor(this.color)}${Color[this.color]} §rteam`);
    }

    public eliminate() {
        this.players[0]?.dimension.runCommand(`title @a[tag=${tagFromColor(this.color)}] title §cELIMINATED`);
    }

    public end() {
        for (const player of this.players) {
            if (!this.hasColor(player)) continue;

            player.removeTag(tagFromColor(this.color));
            if (player.hasTag('class_pvp:eliminated'))
                player.removeTag('class_pvp:eliminated');

            player.nameTag = player.name;
        }
    }

    public removePlayer(remove: Player) {
        const idx = this.players.findIndex((player) =>
            player.id === remove.id);

        const player = this.players[idx];
        player.removeTag(tagFromColor(this.color));
        player.nameTag = player.name;

        this.players.splice(idx, 0);
    }

    public hasColor(player: Player): boolean {
        return player.hasTag(tagFromColor(this.color));
    }
}