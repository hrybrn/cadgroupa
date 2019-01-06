import requests
import json
import sys
from graphql import GraphQLError

def getuserobj(token):
	return discord_req(token, 'https://discordapp.com/api/users/@me')

def discord_req(token, uri):
	api_token = token
	headers = {'Content-Type': 'application/json', 'Authorization': 'Bearer {0}'.format(api_token)}
	response = requests.get(uri, headers=headers)
	if(response.status_code == 200):
		return response.content.decode("utf-8")
	elif(response.status_code == 401):
		raise GraphQLError('There was an error authenticating with Discord.')
	else:
		raise GraphQLError('There was an error connecting to Discord!')
