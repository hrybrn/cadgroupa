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
from resolvers import user, userfriends, games, helloWorld, entityTest, registerSearch, pollSearch


# Super useful 
# - https://github.com/graphql-python/graphql-core/blob/master/tests/starwars/starwars_schema.py
# Note custom type definitions
# You can do some cool things with type + interface definitions + superclassing, but I'll keep this simple until we need
# If anyone is curious then the file linked above is a good exmaple.

# Note that a different schema would be defined for mutations - this is not a complete schema object (see below)
queryschema = GraphQLObjectType(
		'RootQueryType',
		lambda: {
            "games": GraphQLField(
					type= GraphQLString,
					resolver=games
			),
            "helloworld": GraphQLField(
                type=GraphQLString,
                args={
                    "name": GraphQLArgument(
                        type=GraphQLString,
                    )
                },
                resolver=helloWorld
            ),
			"matchmaking": GraphQLField(
				type=GraphQLObjectType(
					name="matchmakingOptions",
					fields={
						"registerSearch": GraphQLField(
							type=GraphQLObjectType(
								name="registerResponse",
								fields={
									"gameID": GraphQLField(
										type=GraphQLString
									),
									"mode": GraphQLField(
										type=GraphQLString
									),
									"registrationID": GraphQLField(
										type=GraphQLString
									),
									"success": GraphQLField(
										type=GraphQLBoolean
									)
								}
							),
							args={
								"token": GraphQLArgument(
									type=GraphQLString
								),
								"gameID": GraphQLArgument(
									type=GraphQLString
								),
								"modeID": GraphQLArgument(
									type=GraphQLString
								),
								"players": GraphQLArgument(
									type=GraphQLString
								),
								"rank": GraphQLArgument(
									type=GraphQLInt
								),
								"lat": GraphQLArgument(
									type=GraphQLFloat
								),
								"lon": GraphQLArgument(
									type=GraphQLFloat
								)
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
									"playerDiscordIDs": GraphQLField(
										type=GraphQLList(
											type=GraphQLString
										)
									)
								}
							),
							args={
								"token": GraphQLArgument(
									type=GraphQLString
								),
								"registrationID": GraphQLArgument(
									type=GraphQLString
								),
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

schema = GraphQLSchema(query=queryschema)
