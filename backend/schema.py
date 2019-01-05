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
from resolvers import user, userfriends, games, helloWorld, entityTest, registerSearch, pollSearch, requestsInSystem, getRecentPlayers


# Super useful 
# - https://github.com/graphql-python/graphql-core/blob/master/tests/starwars/starwars_schema.py
# Note custom type definitions
# You can do some cool things with type + interface definitions + superclassing, but I'll keep this simple until we need
# If anyone is curious then the file linked above is a good exmaple.

# Note that a different schema would be defined for mutations - this is not a complete schema object (see below)
queryschema = GraphQLObjectType(
		"RootQueryType",
		lambda: {
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
							resolver=user
						),
                        "userfriends" : GraphQLField(
							type= GraphQLString,
							args={
								'token' : GraphQLArgument(
									type=GraphQLString
								)
							},
							resolver=userfriends
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
				type=GraphQLList(GraphQLString),
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
					name="matchmakingOptions",
					fields={
						"registerSearch": GraphQLField(
							type=GraphQLObjectType(
								name="registerResponse",
								fields={
									"gameID": GraphQLField(GraphQLString),
									"mode": GraphQLField(GraphQLString),
									"players": GraphQLField(GraphQLInt),
									"rank": GraphQLField(GraphQLInt),
									"lat": GraphQLField(GraphQLFloat),
									"lon": GraphQLField(GraphQLFloat)
								}
							),
							args={
								"token": GraphQLArgument(GraphQLString),
								"gameID": GraphQLArgument(GraphQLString),
								"mode": GraphQLArgument(GraphQLString),
								"players": GraphQLArgument(GraphQLInt),
								"rank": GraphQLArgument(GraphQLInt),
								"lat": GraphQLArgument(GraphQLFloat),
								"lon": GraphQLArgument(GraphQLFloat)
							},
							resolver=registerSearch
						),
                        "poll": GraphQLField(
							type=GraphQLObjectType(
								name="pollResponse",
								fields={
									"token": GraphQLField(
										type=GraphQLString
									),
									"success": GraphQLField(
										type=GraphQLBoolean
									),
									"playerDiscordIDs": GraphQLField(GraphQLList(GraphQLString)),
									"groupDMURL": GraphQLField(GraphQLString)
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
            )
		}
)

schema = GraphQLSchema(query=queryschema)
