from graphql_tools import build_executable_schema
from resolvers import helloworld

with open('schema.graphql', 'r') as schema_file:
    source_schema = schema_file.read()


resolvers = {
    'RootQuery': {
        'helloworld': lambda value, info, **args: 'HelloWorld'
    },
    'HelloWorld': {
        'hi': helloworld
    }
}
schema = build_executable_schema(source_schema, resolvers)
