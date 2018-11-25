import graphql

# build_executable schema
#
# accepts schema_definition (string) and resolvers (object) in style of graphql-tools
# returns a schema ready for execution

# copied from https://gist.github.com/jasonphillips/d80642fc33d98cb34bad131adfcf6ed8

def build_executable_schema(schema_definition, resolvers):
	ast = graphql.parse(schema_definition)
	schema = graphql.build_ast_schema(ast)

	for typeName in resolvers:
		fieldType = schema.get_type(typeName)
		
		for fieldName in resolvers[typeName]:            
			if fieldType is graphql.GraphQLScalarType:
					fieldType.fields[fieldName].resolver = resolvers[typeName][fieldName]
					continue
			
			field = fieldType.fields[fieldName]
			field.resolver = resolvers[typeName][fieldName]
				
		if not fieldType.fields: continue

		for remaining in fieldType.fields:
			if not fieldType.fields[remaining].resolver:
				fieldType.fields[remaining].resolver = \
					lambda value, info, _r=remaining, **args: value[_r]
							
							
	return schema
