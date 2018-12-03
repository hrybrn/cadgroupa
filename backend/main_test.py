from schema import schema
from graphql import graphql 

def test_helloworld():  
	query = '{ discord { helloworld }}'
	expected = { "discord": { "helloworld": "Hello world! Let's kill ourselves" }}
	result = graphql(schema, query)
	assert (not result.errors) and (result.data == expected)

def test_helloworld_named():  
	query = '{ discord { helloworld (name: "test") }}'
	expected = { "discord": { "helloworld": "Hello test! Let's kill ourselves" }}
	result = graphql(schema, query)
	assert (not result.errors) and (result.data == expected)
	