from google.cloud import datastore
import os
import json
import discord
import matchmaking
import users
import sys
from graphql import GraphQLError

from collections import namedtuple

helloWorld = lambda value, info, **args: "Hello " + args['name'] + "!" if 'name' in args else "Hello World!"

class Struct(object):
	def __init__(self, d):
		for a, b in d.items():
			if isinstance(b, (list, tuple)):
				setattr(self, a, [Struct(x) if isinstance(x, dict) else x for x in b])
			else:
				setattr(self, a, Struct(b) if isinstance(b, dict) else b)

def validate(token):
	if not token: 
		raise GraphQLError('There was an error authenticating!')
	userobj = json.loads(discord.getuserobj(token))
	if(userobj['verified'] == "false"):
		raise GraphQLError('The user must be verified with Discord in order to use this app!')
	else:
		return userobj['id']

with open('games.json') as f:
	games_json = json.load(f)

def entityTest(value, info, **args):
	client = datastore.Client()
	key = client.key('Test', args['name'])
	task = datastore.Entity(key)
	task.update({
		'category': 'Personal',
		'done': False,
		'priority': 4,
		'description': args['name']
	})
	client.put(task)
	return json.dumps(client.get(key))

def user(value, info, **args):
	id = validate(args['token'])
	return discord.getuserobj(args['token'])

def games(value, info, **args):
	game_list = []
	for game in games_json:
		game_list.append(Struct(game))
	return game_list

def registerSearch(value, info, **args):
	validate(args['token'])
	#token, location, game, mode, players, rank
	matchmaking.joinQueue(args['token'], args['lat'], args['long'], args['gameID'], args['modeID'],
		args['players'], args['rank'])
	literal = lambda **kw: namedtuple('literal', kw)(**kw)
	return literal(success=True, game="testGame", mode="testMode", registrationID="testID")

def pollSearch(value, info, **args):
	playerid = validate(args['token'])
	matchmaking.pollQueue(args['token'])
	literal = lambda **kw: namedtuple('literal', kw)(**kw)
	return literal(success=True, registrationID=args["registrationID"], playerDiscordIDs=['Insert', 'A', 'List', 'of', 'playerids'])

# for testing purposes
def requestsInSystem(value, info, **args):
	id = validate(args['token'])
	return matchmaking.getMatchRequests(args['gameId'])

def getRecentPlayers( value, info, **args):
	validate(args['token'])
	return users.getRecentPlayers(args["token"])

def changeUserScore(value, info, **args):
	validate(args['token'])
	users.changePlayerRating(args['token'], args['good'])
	return Struct({ "success": True })
