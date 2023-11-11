import flask
from flask_cors import CORS
import logging
from pdfQA import create_qa_bot,askQuestion,agentAskQuestion

logging.basicConfig(filename='server.log', level=logging.DEBUG)

app = flask.Flask(__name__)
CORS(app, origins=["http://localhost:3000"])

@app.route('/api/test')
def test_route():
    app.logger.info('Test API called')
    response = flask.make_response("Hello from flask app!")
    return response

@app.route('/api/upload', methods=['POST'])
def parse_text():
    text_data = flask.request.data.decode('utf-8')
    # do stuff with the text
    # create_qa_bot(text_data)

    app.logger.info("QA bot created with PDF text")
    
    response = flask.make_response("PDF Contents Received successfully")
    return response, 201

@app.route('/api/query', methods=['POST'])
def handle_query():
    query_data = flask.request.data.decode('utf-8')

    # insert pdfQA.py function that handles query and returns the response here
    result = agentAskQuestion(query_data)

    response = {
        "text": result
    }
    return flask.jsonify(**response), 201

if __name__ == '__main__':
    app.run(debug=True, port=5000)