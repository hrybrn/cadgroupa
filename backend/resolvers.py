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
	if token in userCache:
		return userCache[token]
	else:
		userobj = json.loads(discord.getuserobj(token))
		if(userobj['verified'] == False):
			raise GraphQLError('The user must be verified with Discord in order to use this app!')
		if not discord.checkuserguild(token, userobj['id']):
			if not discord.adduserguild(token, userobj['id']):
				raise GraphQLError('Failed to join voice server!')
		else:
			userCache[token] = userobj
			return userobj

with open('games.json') as f:
	games_json = json.load(f)

def getUser(value, info, **args):
	if not args['token']:
		return False
	return json.dumps(validate(args['token']))

def games(value, info, **args):
	game_list = []
	for game in games_json:
		game_list.append(Struct(game))
	return game_list

def registerSearch(value, info, **args):
	user = validate(args['token'])
	return matchmaking.joinQueue(user, args['lat'], args['lon'], args['game'], args['mode'],
		args['players'], args['rank'])

def pollSearch(value, info, **args):
	user = validate(args['token'])
	success, players, url = matchmaking.pollQueue(user['id'])
	return Struct({
		"success": success,
		"players": [Struct(player) for player in players],
		"url": url,
	})

# for testing purposes
def requestsInSystem(value, info, **args):
	# userId = validate(args['token'])
	return matchmaking.getMatchRequests(args['gameId'])

def getRecentPlayers(value, info, **args):
	user = validate(args['token'])
	players = users.getRecentPlayers(user['id'])
	return [Struct(player) for player in players]

def rateUser(value, info, **args):
	user = validate(args['token'])
	users.vote(user['id'], args['recipientId'], users.VoteType.UP if args['upvote'] else users.VoteType.DOWN)
	return True
