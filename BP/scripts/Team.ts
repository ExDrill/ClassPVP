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
            player.addTag(tagFromColor(this.color));

            player.setSpawnPoint({
                dimension: this.players[0].dimension,
                x: this.startPos.x,
                y: this.startPos.y,
                z: this.startPos.z
            });
            player.teleport(player.getSpawnPoint());
            player.nameTag = `§${chatColor(this.color)}${player.name}`;
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
        }
    }

    public removePlayer(remove: Player) {
        const idx = this.players.findIndex((player) =>
            player.id === remove.id);

        this.players[idx].removeTag(tagFromColor(this.color));
        this.players.splice(idx, 0);
    }

    public hasColor(player: Player): boolean {
        return player.hasTag(tagFromColor(this.color));
    }
}