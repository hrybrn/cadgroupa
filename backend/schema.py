from graphql import (
	graphql,
	GraphQLSchema,
	GraphQLObjectType,
	GraphQLField,
	GraphQLString,
	GraphQLInterfaceType,
	GraphQLNonNull,
	GraphQLArgument,
	GraphQLList
)
from resolvers import username, helloWorld, entityTest, goodbyeWorld


# Super useful 
# - https://github.com/graphql-python/graphql-core/blob/master/tests/starwars/starwars_schema.py
# Note custom type definitions	
# You can do some cool things with type + interface definitions + superclassing, but I'll keep this simple until we need
# If anyone is curious then the file linked above is a good exmaple.

# Note that a different schema would be defined for mutations - this is not a complete schema object (see below)
queryschema = GraphQLObjectType(
		'RootQueryType',
		lambda: {
			"discord": GraphQLField(
				type=GraphQLObjectType(
					name="user",
					fields={
						"getusername" : GraphQLField(
							type= GraphQLString,
							args={
								'token' : GraphQLArgument(
									type=GraphQLString
								)
							},
							resolver=username
						)
					}
				),
				# This seems to need to be defined, although it's not used?
				resolver=helloWorld	
			)
		}
)

schema = GraphQLSchema(query=queryschema)