from google.cloud import datastore
import os
import json

helloworld = lambda value, info, **args: 'Hello ' + args['name'] + '! Let\'s kill ourselves' if 'name' in args else 'Hello world! Let\'s kill ourselves'

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
