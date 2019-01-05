from google.cloud import datastore

MAX_RECENT_PLAYERS = 20

client = datastore.Client()

def createUser(token):
	key = client.key('User', token)
	request = datastore.Entity(key)
	request.update({
		'recentPlayers': [],
		'toxicity': 1000,
		'banned': False
	})
	client.put(request)
	return request

def getRecentPlayers(token):
	key = client.key('User', token)
	request = client.get(key)
	return request['recentPlayers'] if request['recentPlayers'] else []

def addRecentPlayers(token, players):
	key = client.key('User', token)
	request = client.get(key)
	recentPlayers = request['recentPlayers'] if request['recentPlayers'] else []
	recentPlayers.extend(players)
	if len(recentPlayers) > MAX_RECENT_PLAYERS:
		for i in range(0, len(recentPlayers) - MAX_RECENT_PLAYERS):
			recentPlayers.pop(0)
	request.update({
		'recentPlayers': recentPlayers
	})
	client.put(request)