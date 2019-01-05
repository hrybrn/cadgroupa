from schema import schema
from graphql import graphql 
import json

def test_helloworld():  
	query = '{ helloworld(name:"Test")  }'
	expected = { "helloworld": "Hello Test!"}
	result = graphql(schema, query)
	assert (not result.errors) and (result.data == expected)

def test_helloworld_named():  
	query = '{ helloworld }'
	expected = { "helloworld": "Hello World!" }
	result = graphql(schema, query)
	assert (not result.errors) and (result.data == expected)

def test_check_games():
	with open('games.json', 'r') as gamesfile:
		data=gamesfile.read()
	query = ' { games { id } }'
	result = graphql(schema, query)
	assert (not result.errors)
