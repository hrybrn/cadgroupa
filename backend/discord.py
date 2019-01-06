import requests
import json
import sys
from graphql import GraphQLError

def getuserobj(token):
	return discord_req(token, 'https://discordapp.com/api/users/@me')


def checkuserguild(token, userid):
	guildid = '531408802357182484'
	headers = {'Content-Type': 'application/json', 'Authorization': 'Bearer {0}'.format(token)}
	response = requests.get('https://discordapp.com/api/guilds/'+guildid + '/members/'+userid, headers=headers)
	return (response.status_code == 200)

def adduserguild(token, userid):
	guildid = '531408802357182484'
	headers = {'Content-Type': 'application/json', 'Authorization': 'Bot {0}'.format('NTE5NTI2MDYxODY0Nzc5ODA4.DxOVxg.FgnV-M1j_aI6eLisJ1vaIRz70q4')}
	jsontext = {'access_token' : token}
	response = requests.put('https://discordapp.com/api/guilds/531408802357182484/members/'+userid, headers=headers, json=jsontext)
	return (response.status_code == 201)

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
