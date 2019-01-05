from google.cloud import datastore
import os
import json
import discord
import matchmaking
import users
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

def validate(**args):
	if not args['token'] or not discord.getuserobj(args["token"]): 
		raise GraphQLError('There was an error authenticating!')
	else:
		return True

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

def user(self, value, info, **args):
	self.validate(args)
	return discord.getuserobj(args['token'])

def userfriends(self, value, info, **args):
	self.validate(args)
	return discord.getuserfriends(args['token'])

def games(value, info, **args):
	game_list = []
	for game in games_json:
		game_list.append(Struct(game))
	return game_list

def registerSearch(self, value, info, **args):
	self.validate(args)
	#token, location, game, mode, players, rank
	matchmaking.joinQueue(args['token'], args['lat'], args['long'], args['gameID'], args['modeID'],
		args['players'], args['rank'])
	literal = lambda **kw: namedtuple('literal', kw)(**kw)
	return literal(success=True, game="testGame", mode="testMode", registrationID="testID")

def pollSearch(self, value, info, **args):
	self.validate(args)
	matchmaking.pollQueue(args['token'])
	literal = lambda **kw: namedtuple('literal', kw)(**kw)
	return literal(success=True, registrationID=args["registrationID"], playerDiscordIDs=["hello", "world"])

# for testing purposes
def requestsInSystem(self, value, info, **args):
	self.validate(args)
	return matchmaking.getMatchRequests(args['gameId'])

def getRecentPlayers(self, value, info, **args):
	self.validate(args)
	return users.getRecentPlayers(args["token"])

def changeUserScore(self, value, info, **args):
	self.validate(args)
	users.changePlayerRating(args['token'], args['good'])
	return "Success"