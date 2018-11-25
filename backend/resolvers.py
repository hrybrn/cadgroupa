helloworld = lambda value, info, **args: 'Hello ' + args['name'] + '! Let\'s kill ourselves' if 'name' in args else 'Hello world! Let\'s kill ourselves'

def entityTest(value, info, **args):
	task = datastore.Entity(client.key('Test', args['name']))
	task.update({
		'category': 'Personal',
		'done': False,
		'priority': 4,
		'description': 'Learn Cloud Datastore'
	})
