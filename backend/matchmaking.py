from google.cloud import datastore
import os
import json

def joinQueue(userId, region, game, rank):
	client = datastore.Client()
	key = client.key('DiscordId', userId)
	game = {
  		'id': 12345,
  		'matchSize': 4
	}
	requestTime = time.clock()
	request = datastore.Entity(key)
	request.update({
		'initialRequestTime': requestTime,
		'lastPollTime': requestTime,
		'rank': rank,
		'gameId': game,
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
	return #continue polling

def findMatch():
	return

def calculateTolerance(initialRequestTime, rank):
    # decrease tolerance as time goes on
    # higer rank = lower tolerance 