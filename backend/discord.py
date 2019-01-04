import requests
import json

def getuserobj(token):
    return discord_req(token, 'https://discordapp.com/api/users/@me')

def getuserfriends(token):
    return discord_req(token, 'https://discordapp.com/api/users/@me/channels')

def discord_req(token, uri):
    api_token = token
    headers = {'Content-Type': 'application/json','Authorization': 'Bearer {0}'.format(api_token)}
    response = requests.get(uri, headers=headers)
    # JSON 
    return response.content.decode("utf-8")
    