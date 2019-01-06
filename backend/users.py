from google.cloud import datastore

MAX_RECENT_PLAYERS = 20

client = datastore.Client()

def createUser(userId):
	key = client.key('User', userId)
	request = datastore.Entity(key)
	request.update({
		'recentPlayers': [],
		'toxicity': 1000,
		'banned': False
	})
	client.put(request)
	return request

def getRecentPlayers(userId):
	key = client.key('User', userId)
	request = client.get(key)
	return request['recentPlayers'] if request['recentPlayers'] else []

def addRecentPlayers(userId, players):
	key = client.key('User', userId)
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

def changePlayerRating(userId, rating_change):
	key = client.key('User', userId)
	request = client.get(key)

	score = request['toxicity']
	score = score - 50 if rating_change else score + 50
	request.update({
		'toxicity': score,
	})
	client.put(request)
	return True


def checkPlayerRating(userId):
	key = client.key('User', userId)
	request = client.get(key)
	score = request['toxicity'] if request['toxicity'] else 0
	return True if score > 0 else False
