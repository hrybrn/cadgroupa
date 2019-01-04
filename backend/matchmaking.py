from google.cloud import datastore
import os
import json

POLL_INTERVAL_TIMEOUT = 10
DEFAULT_MATCH_ID = "BLANK"

client = datastore.Client()

def joinQueue(token, location, game, mode, players, rank):
	key = client.key('MatchRequest', token)
	requestTime = time.clock()
	request = datastore.Entity(key)
	request.update({
		'initialRequestTime': requestTime,
		'lastPollTime': requestTime,
		'rank': rank,
		'gameId': game + ':' + mode,
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

	tolerance = calculateTolerance(currentTime - request['initialRequestTime'])
	maxRankDifference = calculateMaxRankDifference(tolerance)
	maxDistance = calculateMaxDistance(tolerance)

	query = client.query(kind='MatchRequest')
	query.add_filter('gameId', '=', request['game'])
	query.add_filter('lastPollTime', '>', currentTime - POLL_INTERVAL_TIMEOUT)
	query.add_filter('gameSize' '=', request['gameSize'])
	query.add_filter('rank', '>=', request['rank'] - maxRankDifference)
	query.add_filter('rank', '<=', request['rank'] + maxRankDifference)
	query.add_filter('matchId' '=', DEFAULT_MATCH_ID)
	query.order = ['initialRequestTime']

	playersRequired = request['gameSize'] - 1
	players = []
	
	#interate through requests
	for req in query.fetch():
		reqTolerance = calculateTolerance(currentTime - req['initialRequestTime'])
		maxRankDifference = calculateMaxRankDifference(reqTolerance)
		rankDifference = abs(request['rank'] - req['rank'])
		maxDistance = min(calculateMaxDistance(reqTolerance), maxDistance)
		distance = 0 #TODO multiple by 111 for KM
		if (distance < maxDistance and rankDifference < maxRankDifference):
			players.append(req)
			if (len(players) == playersRequired):
				return true, players

	return false, players

def calculateTolerance(elapsedTime):
	return elapsedTime

def calculateMaxRankDifference(tolerance):
	return tolerance * tolerance + 100 # Measured in IDK what

def calculateMaxDistance(tolerance):
	return tolerance * 15 + 200 # Measured in KM

def calculateDistance(lat1, long1, lat2, long2):
	lat = lat2 - lat1
	long = long2 - long1
	a = math.sin(lat/2) * math.sin(lat/2) + math.cos(lat1) * math.cos(lat2) * math.sin(long/2) * math.sin(long/2)
	c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
	return 6371 * c