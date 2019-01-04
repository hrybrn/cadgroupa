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
)
from resolvers import user, userfriends, games, helloWorld, entityTest, registerSearch, pollSearch


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
					name="nestedhelloworld",
					fields={
						"getuser": GraphQLField(
							type= GraphQLString,
							args={
								'token': GraphQLArgument(
									type=GraphQLString
								)
							},
							resolver=helloWorld
						),
                        "userfriends": GraphQLField(
							type= GraphQLString,
							args={
								'token': GraphQLArgument(
									type=GraphQLString
								)
							},
							resolver=goodbyeWorld
						)
					}
				),
				# This seems to need to be defined, although it's not used?
				resolver=helloWorld	
			),
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
									"game": GraphQLField(
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
								"game": GraphQLArgument(
									type=GraphQLString
								),
								"mode": GraphQLArgument(
									type=GraphQLString
								),
							},
							resolver=registerSearch
						),
                        "poll": GraphQLField(
							type=GraphQLObjectType(
								name="pollResponse",
								fields={
									"registrationID": GraphQLField(
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
