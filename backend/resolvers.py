helloworld = lambda value, info, **args: 'Hello ' + args['name'] + '! Let\'s kill ourselves' if 'name' in args else 'Hello world! Let\'s kill ourselves'
