import csgo from 'assets/game-logos/csgo.png';
import dota2 from 'assets/game-logos/dota2.png';
import farcry5 from 'assets/game-logos/farcry5.png';
import fifa19 from 'assets/game-logos/fifa19.png';
import fortnite from 'assets/game-logos/fortnite.png';
import gtav from 'assets/game-logos/gtav.png';
import heartstone from 'assets/game-logos/heartstone.png';
import lol from 'assets/game-logos/lol.png';
import minecraft from 'assets/game-logos/minecraft.png';
import overwatch from 'assets/game-logos/overwatch.png';
import pubg from 'assets/game-logos/pubg.png';
import rocketleague from 'assets/game-logos/rocketleague.png';
import tf2 from 'assets/game-logos/tf2.png';
import tomclancy from 'assets/game-logos/tomclancy.png';

export function getGameLogo(name) {
    switch(name) {
    case 'csgo':
        return csgo;
    case 'dota2':
        return dota2;
    case 'farcry5':
        return farcry5;
    case 'fifa19':
        return fifa19;
    case 'fortnite':
        return fortnite;
    case 'gtav':
        return gtav;
    case 'heartstone':
        return heartstone;
    case 'lol':
        return lol;
    case 'minecraft':
        return minecraft;
    case 'overwatch':
        return overwatch;
    case 'pubg':
        return pubg;
    case 'rocketleague':
        return rocketleague;
    case 'tf2':
        return tf2;
    case 'tomclancy':
        return tomclancy;
    }
}
