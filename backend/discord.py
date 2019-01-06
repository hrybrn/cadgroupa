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
	if(response.status_code == 200):
		return True
	else:
		return False


def adduserguild(token, userid):
	print(token + ' : ' + userid, sys.stderr)
	guildid = '531408802357182484'
	headers = {'Content-Type': 'application/json', 'Authorization': 'Bot {0}'.format('NTE5NTI2MDYxODY0Nzc5ODA4.DxOVxg.FgnV-M1j_aI6eLisJ1vaIRz70q4')}
	print(headers, sys.stderr)
	jsontext = {'access_token' : token}
	response = requests.put('https://discordapp.com/api/guilds/531408802357182484/members/'+userid, headers=headers, json=jsontext)
	if(response.status_code == 200):
		return True
	else:
		print(response.content, sys.stderr)
		print(response.status_code, sys.stderr)
		return False


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
