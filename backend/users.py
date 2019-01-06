from google.cloud import datastore

MAX_RECENT_PLAYERS = 20

client = datastore.Client()

def createUser(userId):
	key = client.key('User', userId)
	user = datastore.Entity(key)
	user.update({
		'recentPlayers': [],
		'toxicity': 1000,
		'banned': False
	})
	client.put(user)
	return user

def getUser(userId):
	key = client.key('User', userId)
	return client.get(key)

def getRecentPlayers(userId):
	user = getUser(userId)
	return user['recentPlayers'] if user['recentPlayers'] else []

def addRecentPlayers(userId, players):
	user = getUser(userId)
	recentPlayers = user['recentPlayers'] if user['recentPlayers'] else []
	recentPlayers.extend(players)
	if len(recentPlayers) > MAX_RECENT_PLAYERS:
		for i in range(0, len(recentPlayers) - MAX_RECENT_PLAYERS):
			recentPlayers.pop(0)
	user.update({
		'recentPlayers': recentPlayers
	})
	client.put(user)

def changePlayerRating(userId, recipient, downVote):
	user = getUser(userId)
	score = user['toxicity']
	score = score - 50 if rating_change else score + 50
	user.update({
		'toxicity': score,
	})
	client.put(user)
	return True

def checkPlayerRating(userId):
	user = getUser(userId)
	score = user['toxicity'] if user['toxicity'] else 0
	return True if score > 0 else False
