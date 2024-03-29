from graphql import (
	graphql,
	GraphQLSchema,
	GraphQLObjectType,
	GraphQLField,
	GraphQLString,
	GraphQLInterfaceType,
	GraphQLNonNull,
	GraphQLArgument,
	GraphQLList,
	GraphQLBoolean,
	GraphQLInt,
	GraphQLFloat
)
from resolvers import getUser, games, helloWorld, registerSearch, pollSearch, requestsInSystem, getRecentPlayers, rateUser
import matchmaking

# Super useful 
# - https://github.com/graphql-python/graphql-core/blob/master/tests/starwars/starwars_schema.py
# Note custom type definitions
# You can do some cool things with type + interface definitions + superclassing, but I'll keep this simple until we need
# If anyone is curious then the file linked above is a good exmaple.

# Note that a different schema would be defined for mutations - this is not a complete schema object (see below)
queryschema = GraphQLObjectType(
	name="RootQueryType",
	fields={
		"discord": GraphQLField(
			type=GraphQLObjectType(
				name="user",
				fields={
					"getuser" : GraphQLField(
						type= GraphQLString,
						args={
							'token' : GraphQLArgument(
								type=GraphQLString
							)
						},
						resolver=getUser
					)
				}
			),
			# This seems to need to be defined, although it's not used?
			resolver=helloWorld	
		),
		"helloworld": GraphQLField(
			type=GraphQLString,
			args={
				"name": GraphQLArgument(GraphQLString)
			},
			resolver=helloWorld
		),
		"recentPlayers": GraphQLField(
			type=GraphQLList(GraphQLObjectType(
				name='RecentPlayer',
				fields={
					"userId": GraphQLField(GraphQLString),
					"displayName": GraphQLField(GraphQLString),
					"avatar": GraphQLField(GraphQLString)
				}
			)),
			args={
				"token": GraphQLArgument(GraphQLString)
			},
			resolver=getRecentPlayers
		),
		"requestsInSystem": GraphQLField(
			type=GraphQLString,
			args={
				"gameId": GraphQLArgument(GraphQLString)
			},
			resolver=requestsInSystem
		),
		"matchmaking": GraphQLField(
			type=GraphQLObjectType(
				name="matchmakingQuery",
				fields={
					"register": GraphQLField(
						type=GraphQLInt,
						args={
							"token": GraphQLArgument(GraphQLString),
							"game": GraphQLArgument(GraphQLString),
							"mode": GraphQLArgument(GraphQLString),
							"players": GraphQLArgument(GraphQLInt),
							"rank": GraphQLArgument(GraphQLInt),
							"lat": GraphQLArgument(GraphQLFloat),
							"lon": GraphQLArgument(GraphQLFloat)
						},
						resolver=registerSearch
					)
				}
			),
			# This seems to need to be defined, although it's not used?
			resolver=helloWorld	
		),
		"games": GraphQLField(
				type=GraphQLList(
					type=GraphQLObjectType(
						name="game",
						fields={
							"id": GraphQLField(GraphQLString),
							"name": GraphQLField(GraphQLString),
							"icon": GraphQLField(GraphQLString),
							"maxplayers": GraphQLField(GraphQLInt),
							"minplayers": GraphQLField(GraphQLInt),
							"minage": GraphQLField(GraphQLInt),
							"description": GraphQLField(GraphQLString),
							"website": GraphQLField(GraphQLString),
							"modes": GraphQLField(GraphQLList(
								type=GraphQLObjectType(
									name="mode",
									fields={
										"name": GraphQLField(GraphQLString),
										"players": GraphQLField(GraphQLInt)
									}
								)
							))
						}
					)
				),
				resolver=games
		),
		"helloworld": GraphQLField(
			type=GraphQLString,
			args={
				'name': GraphQLArgument(GraphQLString)
			},
			resolver=helloWorld
		),
        "testlaunch": GraphQLField(
			type=GraphQLString,
			resolver=matchmaking.launchMatch
		)
	}
)

mutationschema = GraphQLObjectType(
	name="RootMutationType",
	fields={
		"matchmaking": GraphQLField(
			type=GraphQLObjectType(
				name="matchmakingMutations",
				fields={
					"rate":GraphQLField(
						type=GraphQLBoolean,
						args={
							"recipientId":GraphQLArgument(GraphQLString),
							"upvote":GraphQLArgument(GraphQLBoolean),
							"token":GraphQLArgument(GraphQLString)
						},
						resolver=rateUser
					),
					"poll": GraphQLField(
						type=GraphQLObjectType(
							name="pollResponse",
							fields={
								"success": GraphQLField(
									type=GraphQLBoolean
								),
								"players": GraphQLField(GraphQLList(GraphQLObjectType(
									name="TeamMate",
									fields={
										"userId": GraphQLField(GraphQLString),
										"displayName": GraphQLField(GraphQLString),
										"avatar": GraphQLField(GraphQLString)
									}
								))),
								"url": GraphQLField(GraphQLString)
							},
						),
						args={
							"token": GraphQLArgument(GraphQLString)
						},
						resolver=pollSearch
					),
				}
			),
			# This seems to need to be defined, although it's not used?
			resolver=helloWorld	
		)
	}
)

schema = GraphQLSchema(query=queryschema, mutation=mutationschema)
