import csgo from './csgo.png';
import dota2 from './dota2.png';
import farcry5 from './farcry5.png';
import fifa19 from './fifa19.png';
import fortnite from './fortnite.png';
import gtav from './gtav.png';
import heartstone from './heartstone.png';
import lol from './lol.png';
import minecraft from './minecraft.png';
import overwatch from './overwatch.png';
import pubg from './pubg.png';
import rocketleague from './rocketleague.png';
import tf2 from './tf2.png';
import tomclancy from './tomclancy.png';

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
