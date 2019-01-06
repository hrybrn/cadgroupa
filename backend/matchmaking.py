from google.cloud import datastore, exceptions
from graphql import GraphQLError
import os
import json
import time
import math
import discord
import uuid
import sys

POLL_INTERVAL = 5
POLL_INTERVAL_TIMEOUT = 10
DEFAULT_MATCH_ID = 'BLANK'
GAME_MODE_SEPERATOR = ':'
EARTH_RADIUS = 6371 # radius of the earth in km

client = datastore.Client()

def joinQueue(user, lat, long, game, mode, players, rank):
	userId = user['id']
	key = client.key('MatchRequest', userId)
	requestTime = time.time()
	request = datastore.Entity(key)
	request.update({
		'displayName': user['username'],
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
	role_content = discord.createguildrole(matchid)
	role_id = json.loads(role_content.decode("utf-8"))['id']

	discord.createtextchannnel(matchid, role_id)
	channel_content = discord.createvoicechannnel(matchid, role_id)
	channel_id = json.loads(channel_content.decode("utf-8"))['id']

	invite_link = 'https://discord.gg/' + json.loads((discord.getchannelinvitelink(channel_id)).decode("utf-8"))['code']
	for player in players:
		discord.addplayertorole(role_id, player)
	return invite_link

def pollQueue(userId):
	key = client.key('MatchRequest', userId)
	request = client.get(key)
	if request is None:
		raise GraphQLError('User did not register for a match')
	matchId = request['matchId']
	if matchId == DEFAULT_MATCH_ID:
		success, players = findMatch(request)
		url = ""
		if success:
			try:
				players.append({
					'userId': userId,
					'displayName': request['displayName']
				})
				matchId = generateMatchId()
				keys = [client.key('MatchRequest', player['userId']) for player in players]
				with client.transaction():
					requests = client.get_multi(keys)
					for request in requests:
						request.update({
							'matchId': matchId
						})
					client.put_multi(requests)
				url = launchMatch(matchId, [player['userId'] for player in players])
				urlEntity = datastore.Entity(client.key('MatchUrl', matchId))
				urlEntity.update({
					'url': url
				})
				client.put(urlEntity)
			except exceptions.Conflict:
				print("Something went wrong", sys.stderr)
				return False, [], ''
		else:
			request.update({
				'lastPollTime': time.time()
			})
			client.put(request)
		return success, players, url
	else:
		return True, getMatchMembers(matchId), getMatchUrl(matchId)

def getMatchMembers(matchId):
	query = client.query(kind='MatchRequest')
	query.add_filter('matchId', '=', matchId)
	return list(query.fetch())

def getMatchUrl(matchId):
	key = client.key('MatchUrl', matchId)
	result = client.get(key)
	if result is None:
		return ""
	else:
		return result['url']

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
			players.append({
				'userId': req['userId'],
				'displayName': req['displayName']
			})
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
	return str(uuid.uuid4())