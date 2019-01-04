from google.cloud import datastore
import os
import json
from discord import getuserobj, getuserfriends

from collections import namedtuple

helloWorld = lambda value, info, **args: "Hello " + args['name'] + "!" if 'name' in args else "Hello World!"

# print(os.environ['DATASTORE_HOST'])
# print(os.environ['DATASTORE_EMULATOR_HOST'])
class Struct(object):
    def __init__(self, d):
        for a, b in d.items():
            if isinstance(b, (list, tuple)):
               setattr(self, a, [obj(x) if isinstance(x, dict) else x for x in b])
            else:
               setattr(self, a, obj(b) if isinstance(b, dict) else b)


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
	game_list = []
	for game in games_json:
		game_list.append(Struct(game))
	return game_list


def resolver(value, info, **args):
    if not args['token']:
        return '401: Unauthorized'
    else:
        return 'Brad'