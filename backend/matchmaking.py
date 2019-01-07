from google.cloud import datastore, exceptions
from graphql import GraphQLError
import users
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
	if players <= 1:
		raise GraphQLError("Invalid number of players")
	userId = user['id']
	avatar = ''
	if 'avatar' in user:
		avatar = f'https://cdn.discordapp.com/avatars/{userId}/{user['avatar']}.png?size=256'
	toxicity = users.getToxicity(userId)
	if toxicity > 20:
		#is that a ban?
		raise GraphQLError("Due to a large number of negative reports against your account, you are temporarily banned from our service. Try again soon.")
	key = client.key('MatchRequest', userId)
	requestTime = time.time()
	request = datastore.Entity(key)
	request.update({
		'displayName': user['username'],
		'avatar': avatar,
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

def launchMatch(matchId, players, request):
	role_content = discord.createguildrole(matchId)
	role_id = json.loads(role_content.decode("utf-8"))['id']

	text_channel_content = discord.createtextchannnel(matchId, role_id)
	voice_channel_content = discord.createvoicechannnel(matchId, role_id)
	text_channel_id = json.loads(text_channel_content.decode("utf-8"))['id']
	voice_channel_id = json.loads(voice_channel_content.decode("utf-8"))['id']

	invite_link = 'https://discord.gg/' + json.loads((discord.getchannelinvitelink(voice_channel_id)).decode("utf-8"))['code']
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
					'displayName': request['displayName'],
					'avatar': request['avatar']
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
				url = launchMatch(matchId, [player['userId'] for player in players], request)
				match = datastore.Entity(client.key('Match', matchId))
				match.update({
					'url': url,
					'players': players
				})
				client.put(match)
				users.addRecentPlayers(userId, players)
				return success, players, url
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
		match = getExistingMatch(matchId)
		if match is None:
			return False, [], ''
		else:
			players = match['players']
			users.addRecentPlayers(userId, players)
			return True, players, match['url']

def getExistingMatch(matchId):
	key = client.key('Match', matchId)
	match = client.get(key)
	return match

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
				'displayName': req['displayName'],
				'avatar': req['avatar']
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