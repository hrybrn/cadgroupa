from graphql_tools import build_executable_schema

with open('schema.graphql', 'r') as schema_file:
    source_schema = schema_file.read()

def helloworld(self, info, **args):
    if 'name' in args:
        return 'Hello world! Let\'s ' + args['name']
    else:
        return 'Hello world! Let\'s kill ourselves'

resolvers = {
    'RootQuery': {
        'helloworld': helloworld
    }
}
schema = build_executable_schema(source_schema, resolvers)
