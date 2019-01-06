import requests
import json
import sys
from graphql import GraphQLError

URL_BASE = 'https://discordapp.com/api/'
BOT_TOKEN = 'NTE5NTI2MDYxODY0Nzc5ODA4.DxOVxg.FgnV-M1j_aI6eLisJ1vaIRz70q4'
GUILD_ID = '531408802357182484'

def getuserobj(token):
	headers = {'Content-Type': 'application/json', 'Authorization': 'Bearer {0}'.format(token)}
	response = requests.get(URL_BASE + 'users/@me', headers=headers)
	if(response.status_code == 200):
		return response.content.decode("utf-8")
	elif(response.status_code == 401):
		raise GraphQLError('There was an error authenticating with Discord. Status='+str(response.status_code))
	else:
		raise GraphQLError('There was an error connecting to Discord!' + str(response.status_code))

def checkuserguild(token, userid):
	guildid = '531408802357182484'
	headers = {'Content-Type': 'application/json', 'Authorization': 'Bot {0}'.format(BOT_TOKEN)}
	response = requests.get(URL_BASE + 'guilds/'+guildid + '/members/'+userid, headers=headers)
	return (response.status_code == 200)

def adduserguild(token, userid):
	headers = {'Content-Type': 'application/json', 'Authorization': 'Bot {0}'.format(BOT_TOKEN)}
	jsontext = {'access_token' : token}
	response = requests.put(URL_BASE + 'guilds/' + GUILD_ID + '/members/'+userid, headers=headers, json=jsontext)
	return (response.status_code == 201)

def createguildrole(matchid):
	headers = {'Content-Type': 'application/json', 'Authorization': 'Bot {0}'.format(BOT_TOKEN)}
	jsontext = { 'name' : matchid }
	response = requests.post(URL_BASE + 'guilds/' + GUILD_ID + '/roles', headers=headers, json=jsontext)
	if (response.status_code == 200):
		return response.content
	raise GraphQLError('Failed to create server role for new channel.' + str(response.status_code))

def createvoicechannnel(matchid, roleid):
	headers = {'Content-Type': 'application/json', 'Authorization': 'Bot {0}'.format(BOT_TOKEN)}
	jsontext = { 'name' : str(matchid), 'type' : 2, 'permission_overwrites' : [{ 'id' : str(roleid), 'type': 'role'}] }
	response = requests.post(URL_BASE + 'guilds/' + GUILD_ID + '/channels', headers=headers, json=jsontext)
	if (response.status_code == 201):
		return response.content
	raise GraphQLError('Failed to create channel. status=' + str(response.status_code))

def createtextchannnel(matchid, roleid):
	headers = {'Content-Type': 'application/json', 'Authorization': 'Bot {0}'.format(GUILD_ID)}
	jsontext = { 'name' : str(matchid), 'type' : 0, 'permission_overwrites' : [{ 'id' : str(roleid), 'type': 'role'}] }
	response = requests.post(URL_BASE + 'guilds/' + GUILD_ID + '/channels', headers=headers, json=jsontext)
	if (response.status_code == 201):
		return True
	raise GraphQLError('Failed to create channel. Status=' + str(response.status_code))

def getchannelinvitelink(channelid):
	headers = {'Content-Type': 'application/json', 'Authorization': 'Bot {0}'.format(BOT_TOKEN)}
	response = requests.post(URL_BASE + 'channels/' + str(channelid) + '/invites' , headers=headers, json={})
	return response.content

def addplayertorole(matchid, player):
	headers = {'Content-Type': 'application/json', 'Authorization': 'Bot {0}'.format(BOT_TOKEN)}
	response = requests.put(URL_BASE + 'guilds/' + GUILD_ID  + '/members/'+player+'/roles/'+str(matchid), headers=headers)
	return (response.status_code == 204)
