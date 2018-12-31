from google.cloud import datastore
import os
import json
import requests

helloWorld = lambda value, info, **args: 'Hello ' + args['name'] + '! Let\'s kill ourselves' if 'name' in args else 'Hello world! Let\'s kill ourselves'

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



def username(value, info, **args):
	api_token = args['token']
	api_url_base = 'https://discordapp.com/api/users/@me'
	headers = {'Content-Type': 'application/json',
        	'Authorization': 'Bearer {0}'.format(api_token)}
	response = requests.get(api_url_base, headers=headers)
	return json.loads(response.content)['username']