from google.cloud import datastore
import os
import json
import time
import math

POLL_INTERVAL = 5
POLL_INTERVAL_TIMEOUT = 10
DEFAULT_MATCH_ID = 'BLANK'
GAME_MODE_SEPERATOR = ':'
EARTH_RADIUS = 6371 # radius of the earth in km

client = datastore.Client()

def joinQueue(userId, lat, long, game, mode, players, rank):
	key = client.key('MatchRequest', userId)
	requestTime = time.clock()
	request = datastore.Entity(key)
	request.update({
		'userId': userId,
		'initialRequestTime': requestTime,
		'lastPollTime': requestTime,
		'rank': rank,
		'gameId': game + GAME_MODE_SEPERATOR + mode,
		'gameSize': players,
		'matchId': DEFAULT_MATCH_ID,
		'latitude': lat,
		'longitude': long
	})
	client.put(request)
	return POLL_INTERVAL

def launchMatch(players):
	return

def pollQueue(userId):
	key = client.key('MatchRequest', userId)
	request = client.get(key)
	request.update({
		'lastPollTime': time.clock()
	})
	client.put(request)
	# see if a match can be made
	success, players = findMatch(request)
	url = "http://www.example.com/" if success else ""
	return success, players, url

def findMatch(request):
	currentTime = time.clock()

	tolerance = calculateTolerance(currentTime - request['initialRequestTime'])
	maxRankDifference = calculateMaxRankDifference(tolerance)
	maxDistance = calculateMaxDistance(tolerance)

	query = client.query(kind='MatchRequest')
	query.add_filter('gameId', '=', request['gameId'])
	query.add_filter('lastPollTime', '>', currentTime - POLL_INTERVAL_TIMEOUT)
	query.add_filter('gameSize', '=', request['gameSize'])
	query.add_filter('rank', '>=', request['rank'] - maxRankDifference)
	query.add_filter('rank', '<=', request['rank'] + maxRankDifference)
	query.add_filter('matchId', '=', DEFAULT_MATCH_ID)
	query.order = ['initialRequestTime']

	playersRequired = request['gameSize'] - 1
	players = []
	
	#interate through requests
	for req in query.fetch():
		if req['userId'] == request['userId']:
			continue
		reqTolerance = calculateTolerance(currentTime - req['initialRequestTime'])
		maxRankDifference = calculateMaxRankDifference(reqTolerance)
		rankDifference = abs(request['rank'] - req['rank'])
		maxDistance = min(calculateMaxDistance(reqTolerance), maxDistance)
		distance = calculateDistance(request['latitude'], request['longitude'], req['latitude'], req['longitude'])
		if (distance < maxDistance and rankDifference < maxRankDifference):
			players.append(req['userId'])
			if (len(players) == playersRequired):
				return True, players

	return False, players

def calculateTolerance(elapsedTime):
	return elapsedTime

def calculateMaxRankDifference(tolerance):
	return tolerance * tolerance + 100 # Measured in IDK what

def calculateMaxDistance(tolerance):
	return tolerance * 15 + 200 # Measured in KM

def calculateDistance(lat1, long1, lat2, long2):
	latR1, longR1, latR2, longR2 = math.radians(lat1), math.radians(long1), math.radians(lat2), math.radians(long2)
	latR = latR2 - latR1
	longR = longR2 - longR1
	a = math.sin(latR/2) * math.sin(latR/2) + math.cos(latR1) * math.cos(latR2) * math.sin(longR/2) * math.sin(longR/2)
	c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
	return EARTH_RADIUS * c

def getMatchRequests(gameId):
	query = client.query(kind='MatchRequest')
	query.add_filter('gameId', '=', gameId)
	return json.dumps(list(query.fetch()))