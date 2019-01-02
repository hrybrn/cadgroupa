from google.cloud import datastore
import os
import json

client = datastore.Client()

def joinQueue(userId, region, game, matchSize, rank):
	key = client.key('MatchRequest', userId)
	requestTime = time.clock()
	request = datastore.Entity(key)
	request.update({
		'initialRequestTime': requestTime,
		'lastPollTime': requestTime,
		'rank': rank,
		'gameId': game,
		'matchSize': matchSize,
		'matchId': '',
		'region': region,
	})
	client.put(request)
	return request

def pollQueue(userId):
	client = datastore.Client()
	key = client.key('DiscordId', userId)
	request = client.get(key)
	request.update({
		'lastPollTime': time.clock()
	})
	client.put(request)

	# see if a match can be made
	findMatch(game)
	return #continue polling

def findMatch(game):
	query = client.query(kind='MatchRequest')
	query.add_filter('gameId', '=', game)
	query.order = ['+initialRequestTime']
	query = client.query()
	matchRequests = list(query.fetch())

	#interate through requests
	for req in matchRequests:


	return

def calculateTolerance(initialRequestTime, rank):
    # decrease tolerance as time goes on
    # higer rank = lower tolerance 
	return