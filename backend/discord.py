import requests
import json

def getuserobj(token):
	api_token = token
	api_url_base = 'https://discordapp.com/api/users/@me'
	headers = {'Content-Type': 'application/json','Authorization': 'Bearer {0}'.format(api_token)}
	response = requests.get(api_url_base, headers=headers)
    # JSON 
	return response.content.decode("utf-8")
