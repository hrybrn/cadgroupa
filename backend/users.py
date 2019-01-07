from google.cloud import datastore
from enum import Enum
import time
import math

MAX_RECENT_PLAYERS = 20
SECONDS_IN_DAY = 86400

class VoteType(Enum):
	DOWN = 'Down'
	UP = 'Up'

client = datastore.Client()

def createUser(userId):
	key = client.key('User', userId)
	user = datastore.Entity(key)
	user.update({
		'recentPlayers': [],
		'votesDown': 0,
		'votesUp': 0,
		'lastDownVote': 0,
		'lastUpVote': 0,
		'banned': False
	})
	client.put(user)
	return user

def getUser(userId):
	key = client.key('User', userId)
	user = client.get(key)
	if user is None:
		return createUser(userId)
	else:
		return user

def getRecentPlayers(userId):
	user = getUser(userId)
	return user['recentPlayers'] if 'recentPlayers' in user else []

def addRecentPlayers(userId, players):
	user = getUser(userId)
	recentPlayers = user['recentPlayers'] if 'recentPlayers' in user else []
	for player in players:
		if player['userId'] != userId:
			recentPlayers.append({'userId': player['userId'], 'displayName': player['displayName']})
	if len(recentPlayers) > MAX_RECENT_PLAYERS:
		for i in range(0, len(recentPlayers) - MAX_RECENT_PLAYERS):
			recentPlayers.pop(0)
	user.update({
		'recentPlayers': recentPlayers
	})
	client.put(user)

def getVotes(user, voteEnum):
	voteType = voteEnum.value
	if 'votes' + voteType in user:
		elapsedDays = (time.time() - user['last' + voteType + 'Vote']) / SECONDS_IN_DAY
		return user['votes' + voteType] * math.pow(0.5, elapsedDays)
	else:
		return 0

def vote(userId, recipientId, voteType):
	recipient = getUser(recipientId)
	votes = getVotes(recipient, voteType)
	recipient.update({
		'votes' + voteType: votes + 1,
		'last' + voteType + 'Vote': time.time()
	})
	client.put(recipient)

def getToxicity(userId):
	user = getUser(userId)
	return getVotes(user, VoteType.DOWN) - getVotes(user, VoteType.UP)