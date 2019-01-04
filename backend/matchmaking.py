from google.cloud import datastore
import os
import json

POLL_INTERVAL_TIMEOUT = 10
DEFAULT_MATCH_ID = "BLANK"

client = datastore.Client()

def joinQueue(token, location, game, players, rank):
	key = client.key('MatchRequest', token)
	requestTime = time.clock()
	request = datastore.Entity(key)
	request.update({
		'initialRequestTime': requestTime,
		'lastPollTime': requestTime,
		'rank': rank,
		'gameId': game,
		'gameSize': players,
		'matchId': DEFAULT_MATCH_ID,
		'location': location,
	})
	client.put(request)
	return request

def pollQueue(token):
	key = client.key('MatchRequest', token)
	request = client.get(key)
	request.update({
		'lastPollTime': time.clock()
	})
	client.put(request)
	# see if a match can be made
	success, players = findMatch(request)
	if (success):
		#launch match
		return false
	else:
		return true #continue polling

def findMatch(request):
	currentTime = time.clock()

	acceptance = calculateAcceptance(currentTime - request['initialRequestTime'])
	maxRankDifference = calculateMaxRankDifference(acceptance)
	maxDistance = calculateMaxDistance(acceptance)

	query = client.query(kind='MatchRequest')
	query.add_filter('gameId', '=', request['game'])
	query.add_filter('lastPollTime', '>', currentTime - POLL_INTERVAL_TIMEOUT)
	query.add_filter('gameSize' '=', request['gameSize'])
	query.add_filter('rank', '>=', request['rank'] - maxRankDifference)
	query.add_filter('rank', '<=', request['rank'] + maxRankDifference)
	query.add_filter('matchId' '=', DEFAULT_MATCH_ID)
	query.order = ['initialRequestTime']

	requestedPlayerCount = request['gameSize'] - 1
	players = []
	
	#interate through requests
	for req in query.fetch():
		otherRequestAcceptance = calculateAcceptance(currentTime - req['initialRequestTime'])
		maxRankDifference = calculateMaxRankDifference(acceptance)
		rankDifference = abs(request['rank'] - req['rank'])
		maxDistance = min(calculateMaxDistance(otherRequestAcceptance), maxDistance)
		distance = 0 #TODO multiple by 111 for KM
		if (distance < maxDistance && rankDifference < maxRankDifference)
			players.append(req)
			if (len(players) == requestedPlayerCount):
				return true, players

	return false, players

def calculateTolerance(elapsedTime):
    # decrease tolerance as time goes on
    # higer rank = lower tolerance 
	return 100000 if elapsedTime > 60 else elapsedTime * elapsedTime + 100

def calculateAcceptance(elapsedTime)
	return elapsedTime

def calculateMaxRankDifference(acceptance)
	return acceptance * acceptance + 100 # Measured in IDK what

def calculateMaxDistance(acceptance)
	return acceptance * 15 + 200 # Measured in KM

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
