from google.cloud import datastore
import os
import json
import time
import math
import discord
import uuid
from graphql import GraphQLError

POLL_INTERVAL = 5
POLL_INTERVAL_TIMEOUT = 10
DEFAULT_MATCH_ID = 'BLANK'
GAME_MODE_SEPERATOR = ':'
EARTH_RADIUS = 6371 # radius of the earth in km

client = datastore.Client()

def joinQueue(userId, lat, long, game, mode, players, rank):
	key = client.key('MatchRequest', userId)
	requestTime = time.time()
	request = datastore.Entity(key)
	request.update({
		'displayName': 'Brad',
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

# def launchMatch(matchid, players):
def launchMatch(matchid, players):
	matchid = '453859438'
	players = ['531471720230551552', '528999232594509844']
	discord.createguildrole(matchid)
	discord.createguildchannnel(matchid)
	for player in players:
		discord.addplayertorole(matchid, player)
	return True

def pollQueue(userId):
	key = client.key('MatchRequest', userId)
	request = client.get(key)
	if request is None:
		raise GraphQLError('User did not register for a match')
	matchId = request['matchId']
	if matchId == DEFAULT_MATCH_ID:
		request.update({
			'lastPollTime': time.time()
		})
		success, players = findMatch(request)
		url = "http://www.example.com/" if success else ""
		if success:
			matchId = generateMatchId()
			player.append(request)
			for player in players:
				player.update({
					'matchId': matchId
				})
			client.put_multi(players)
			#launchMatch(matchId, players)
		else:
			client.put(request)
		return success, players, url
	else:
		return True, ['lol'], "http://www.youvebeenhad.com/"

def findMatch(request):
	currentTime = time.time()

	tolerance = calculateTolerance(currentTime - request['initialRequestTime'])
	maxRankDifference = calculateMaxRankDifference(tolerance)
	maxDistance = calculateMaxDistance(tolerance)

	minPollTime = currentTime - POLL_INTERVAL_TIMEOUT

	query = client.query(kind='MatchRequest')
	query.add_filter('gameId', '=', request['gameId'])
	query.add_filter('gameSize', '=', request['gameSize'])
	query.add_filter('matchId', '=', DEFAULT_MATCH_ID)
	query.order = ['initialRequestTime']

	playersRequired = request['gameSize'] - 1
	players = []
	
	#interate through requests
	for req in query.fetch():
		if req['userId'] == request['userId']:
			continue
		if req['lastPollTime'] < minPollTime:
			continue
		reqTolerance = calculateTolerance(currentTime - req['initialRequestTime'])
		maxRankDifference = min(calculateMaxRankDifference(reqTolerance), maxRankDifference)
		rankDifference = abs(request['rank'] - req['rank'])
		maxDistance = min(calculateMaxDistance(reqTolerance), maxDistance)
		distance = calculateDistance(request['latitude'], request['longitude'], req['latitude'], req['longitude'])
		if (distance <= maxDistance and rankDifference <= maxRankDifference):
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

def generateMatchId():
	# uuid4 generates a random uuid
	return uuid.uuid4()