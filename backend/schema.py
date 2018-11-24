import graphene
from graphene import relay

class Query(graphene.ObjectType):
    helloworld = graphene.String(argument=graphene.String(default_value="Kill ourselves"))

    def resolve_helloworld(self, info, argument):
        return "Hello world! Let's " + argument

schema = graphene.Schema(query=Query)