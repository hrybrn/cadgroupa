from google.cloud import datastore
import os
import json
import matchmaking
import users

from collections import namedtuple

helloWorld = lambda value, info, **args: "Hello " + args['name'] + "!" if 'name' in args else "Hello World!"


# print(os.environ['DATASTORE_HOST'])
# print(os.environ['DATASTORE_EMULATOR_HOST'])

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
	if not args['token']: 
		return '401: Unauthorized'
	else:
		return getuserobj(args['token'])

def userfriends(value, info, **args):
	if not args['token']: 
		return '401: Unauthorized'
	else:
		return getuserfriends(args['token'])

def games(value, info, **args):
	return json.dumps(games_json)

def registerSearch(value, info, **args):
	if not args['token']: 
		return '401: Unauthorized'
	else:
		#token, location, game, mode, players, rank
		matchmaking.joinQueue(args['token'], args['lat'], args['long'], args['gameID'], args['modeID'],
			args['players'], args['rank'])
		literal = lambda **kw: namedtuple('literal', kw)(**kw)
		return literal(success=True, game="testGame", mode="testMode", registrationID="testID")

def pollSearch(value, info, **args):
	if not args['token']: 
		return '401: Unauthorized'
	else:
		matchmaking.pollQueue(args['token'])
		literal = lambda **kw: namedtuple('literal', kw)(**kw)
		return literal(success=True, registrationID=args["registrationID"], playerDiscordIDs=["hello", "world"])

# for testing purposes
def requestsInSystem(value, info, **args):
	return matchmaking.getMatchRequests(args['gameId'])

def getRecentPlayers(value, info, **args):
	return users.getRecentPlayers(args["token"])
