import { Player, Vector3, world } from "@minecraft/server";

export default class Team {
    public color: string;
    public players: Player[];
    public startPos: Vector3;

    public constructor(color: string, players: Player[], startPos: Vector3) {
        this.color = color;
        this.players = players;
        this.startPos = startPos;
    }

    public start() {
        for (const player of this.players) {
            player.addTag(this.color);
            player.teleport(this.startPos);
        }
    }

    public eliminate() {
        world.getDimension('overworld').runCommand(`title @a[tag=${this.color}] title §cELIMINATED`);
    }
}