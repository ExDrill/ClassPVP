import { world } from '@minecraft/server'
import Game from './gamemode/game';
import Team from './team'
import { Color, randomColor, tagPrefix, tagFromColor } from './gamemode/colors'

let game: Game;

world.afterEvents.chatSend.subscribe((event) => {
    switch (event.message) {
        case 'start': {
            if (game) game.end();

            game = new Game([new Team(randomColor(), [event.sender], { x: 0, y: 0, z: 0 })]);
            game.start();
            break;
        }
        case 'elim': {
            if (!game) {
                event.sender.sendMessage('start a game to run this command');
                return;
            }

            const tag: string = event.sender.getTags().find((tag) =>
                tag.startsWith(tagPrefix));
            if (!tag) return;

            const targetColor: Color = Color[tag.substring(tagPrefix.length)];

            const team: Team = game.getTeamByColor(targetColor);
            if (!team) return;
            team.eliminate();

            event.sender.sendMessage(`${Color[targetColor]} team eliminated.`);
            break;
        }
        case 'end': {
            if (!game) {
                event.sender.sendMessage('start a game to run this command');
                return;
            }

            game.end();
            game = undefined;
            break;
        }
    }
})

world.beforeEvents.playerLeave.subscribe((event) => {
    if (!game) return;

    const tag: string = event.player.getTags().find((tag) =>
        tag.startsWith(tagPrefix));
    if (!tag) return;

    const targetColor: Color = Color[tag.substring(tagPrefix.length)];
    const team: Team = game.getTeamByColor(targetColor);
    if (!team) return;

    team.removePlayer(event.player);
})