from django.shortcuts import HttpResponse
from django.template import RequestContext, loader
import os, json

def index(request):
    template = loader.get_template('pvlinks/index.html')
    return HttpResponse(template.render())


def getPvData(request):
    nodes = getDataFile("nodes.json")
    links = getDataFile("links.json")
    list = {"nodes": nodes, "links": links}
    return HttpResponse(json.dumps(list, ensure_ascii=False), content_type="application/json")


def getDataFile(name):
    with open(os.path.dirname(os.path.abspath(__file__))+'/data/'+name) as data_file:
        data = json.load(data_file)
    return data