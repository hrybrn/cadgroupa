from flask import Flask
from flask_cors import CORS, cross_origin
from flask_graphql import GraphQLView
from schema import schema

app = Flask(__name__)
cors = CORS(app, resources={r"/graphql": {"origins": "*"}})
app.config['CORS_HEADERS'] = 'Content-Type'
app.add_url_rule('/graphql', view_func=GraphQLView.as_view('graphql', schema=schema, graphiql=True))
if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8080, debug=True)
# [END gae_python37_app]
