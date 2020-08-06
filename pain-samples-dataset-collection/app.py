from flask import Flask, render_template, request
from flask_cors import CORS, cross_origin
import json
import pymongo

app = Flask(__name__)
CORS(app)
@cross_origin() 

myclient = pymongo.MongoClient('mongodb+srv://<USER>:<PASSWORD>@cluster0-kam8g.mongodb.net/test?retryWrites=true&w=majority')
mydb = myclient['makeathon']

@app.route("/", methods=["POST"])
def index():
    req = request.get_json()
    req = req['painSamples']
    d = dict()
    d['emotions'] = req[0]
    d['expressions'] = req[1]
    mycol = mydb['pain']
    mycol.insert(d)

    return "", 204


@app.route("/nopain", methods=["POST"])
def index2():
    req = request.get_json()
    req = req['noPainSamples']
    d = dict()
    d['emotions'] = req[0]
    d['expressions'] = req[1]
    mycol = mydb['nopain']
    mycol.insert(d)

    return "", 204
