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
	GraphQLInt
)
from resolvers import user, userfriends, games, helloWorld, entityTest


# Super useful 
# - https://github.com/graphql-python/graphql-core/blob/master/tests/starwars/starwars_schema.py
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
            "games": GraphQLField(
					type= GraphQLList(
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
                    'name': GraphQLArgument(
                        type=GraphQLString,
                    )
                },
                resolver=helloWorld
            )
		}
)

schema = GraphQLSchema(query=queryschema)
