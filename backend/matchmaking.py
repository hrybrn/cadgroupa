from google.cloud import datastore
import os
import json

POLL_INTERVAL_TIMEOUT = 10

client = datastore.Client()

def joinQueue(userId, location, game, players, rank):
	key = client.key('MatchRequest', userId)
	requestTime = time.clock()
	request = datastore.Entity(key)
	request.update({
		'initialRequestTime': requestTime,
		'lastPollTime': requestTime,
		'rank': rank,
		'gameId': game,
		'players': players,
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
	filterTime = tick.clock() - POLL_INTERVAL_TIMEOUT
	query = client.query(kind='MatchRequest')
	query.add_filter('gameId', '=', request['game'])
	query.add_filter('lastPollTime', '>', filterTime)
	query.add_filter('matchId' '=', '')
	query.order = ['initialRequestTime']
	
	#interate through requests
	for req in query.fetch():
		print(req.key)

	return

def calculateTolerance(initialRequestTime, rank):
    # decrease tolerance as time goes on
    # higer rank = lower tolerance 
	return