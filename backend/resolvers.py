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

userCache = {}

def validate(token):
	if not token:
		raise GraphQLError('There was an error authenticating!')
	if userCache[token]:
		return userCache[token]
	userobj = json.loads(discord.getuserobj(token))
	if(userobj['verified'] == "false"):
		raise GraphQLError('The user must be verified with Discord in order to use this app!')
	else:
		userCache[token] = userobj['id']
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
	userId = validate(args['token'])
	#token, location, game, mode, players, rank
	return matchmaking.joinQueue(userId, args['lat'], args['lon'], args['game'], args['mode'],
		args['players'], args['rank'])

def pollSearch(value, info, **args):
	userId = validate(args['token'])
	success, players, url = matchmaking.pollQueue(userId)
	return Struct({
		"success": success,
		"players": players,
		"url": url,
	})

# for testing purposes
def requestsInSystem(value, info, **args):
	# userId = validate(args['token'])
	return matchmaking.getMatchRequests(args['gameId'])

def getRecentPlayers(value, info, **args):
	userId = validate(args['token'])
	return users.getRecentPlayers(userId)

def changeUserScore(value, info, **args):
	userId = validate(args['token'])
	users.vote(userId, users.VoteType.UP if args['good'] else users.VoteType.DOWN)
	return Struct({ "success": True })
