from google.cloud import datastore
import os
import json

POLL_INTERVAL_TIMEOUT = 10

client = datastore.Client()

def joinQueue(userId, location, game, players, maxPlayers, rank):
	key = client.key('MatchRequest', userId)
	requestTime = time.clock()
	request = datastore.Entity(key)
	request.update({
		'initialRequestTime': requestTime,
		'lastPollTime': requestTime,
		'rank': rank,
		'gameId': game,
		'partySize': players,
		'gameSize': maxPlayers,
		'matchId': '',
		'location': location,
	})
	client.put(request)
	return request

def pollQueue(userId):
	key = client.key('DiscordId', userId)
	request = client.get(key)
	request.update({
		'lastPollTime': time.clock()
	})
	client.put(request)
	# see if a match can be made
	findMatch(request)
	return #continue polling

def findMatch(request):
	currentTime = time.clock()
	query = client.query(kind='MatchRequest')
	tolerance = calculateTolerance(currentTime - request['initialRequestTime'])
	query.add_filter('gameId', '=', request['game'])
	query.add_filter('lastPollTime', '>', currentTime - POLL_INTERVAL_TIMEOUT)
	query.add_filter('gameSize' '=', request['gameSize'])
	query.add_filter('rank', '>=', request['rank'] - tolerance)
	query.add_filter('rank', '<=', request['rank'] + tolerance)
	query.add_filter('matchId' '=', '')
	query.order = ['initialRequestTime']

	players = []
	
	#interate through requests
	for req in query.fetch():

		print(req.key)


	return

def calculateTolerance(elapsedTime):
    # decrease tolerance as time goes on
    # higer rank = lower tolerance 
	return 100000 if elapsedTime > 30 else elapsedTime * elapsedTime * 2 + 100



# tolerance band idea
import sys
class ToleranceBand(Enum):
    INITIAL = 10
    SHORT_WAIT = 20
	MEDIUM_WAIT = 30
	LONG_WAIT = sys.maxsize

class RankAllowance(Enum):
    INITIAL = 10
    SHORT_WAIT = 50
	MEDIUM_WAIT = 100
	LONG_WAIT = sys.maxsize

def calculateToleranceBand(elapsedTime):
	if elapsedTime < ToleranceBand.INITIAL:
		return ToleranceBand.INITIAL

	elif elapsedTime < SHORT_WAIT:
		return ToleranceBand.SHORT_WAIT

	elif elapsedTime < MEDIUM_WAIT:
		return ToleranceBand.MEDIUM_WAIT
	
	else:
		return ToleranceBand.LONG_WAIT

def calculateRankAllowance(toleranceBand):
	if toleranceBand == ToleranceBand.INITIAL:
		return RankAllowance.INITIAL

	elif toleranceBand == ToleranceBand.SHORT_WAIT:
		return RankAllowance.SHORT_WAIT

	elif toleranceBand == ToleranceBand.MEDIUM_WAIT:
		return RankAllowance.MEDIUM_WAIT
	
	else:
		return RankAllowance.LONG_WAIT

def findMatch(request):
	currentTime = time.clock()
	toleranceBand = calculateTolerance(currentTime - request['initialRequestTime'])
	rankAllowance = calculateRankAllowance(toleranceBand)
	
	query = client.query(kind='MatchRequest')

	query.add_filter('gameId', '=', request['game'])
	query.add_filter('lastPollTime', '>', currentTime - POLL_INTERVAL_TIMEOUT)
	query.add_filter('gameSize' '=', request['gameSize'])
	query.add_filter('matchId' '=', '')
	query.add_filter('rank', '>=', request['rank'] - rankAllowance)
	query.add_filter('rank', '<=', request['rank'] + rankAllowance)
	query.order = ['initialRequestTime']

	matchedPlayers = []
	
	#interate through requests
	for req in query.fetch():
		if  matchedPlayers < request['gameSize']:
			players.append(req)
		else:
			return matchedPlayers
	return []
