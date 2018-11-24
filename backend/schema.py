import graphene

class Query(graphene.ObjectType):
    helloworld = graphene.String(argument=graphene.String(default_value="Kill ourselves"))
    resolve_helloworld = lambda self, info, argument: "Hello world! Let's " + argument

schema = graphene.Schema(query=Query)