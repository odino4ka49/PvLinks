from django.shortcuts import HttpResponse
from django.template import RequestContext, loader
import os, json


def index(request):
    template = loader.get_template('pvlinks/index.html')
    return HttpResponse(template.render())


def pvlist(request,id=None):
    template = loader.get_template('pvlinks/pvlist.html')
    return HttpResponse(template.render())


def getAllData(request):
    nodes = getDataFile("nodes.json")
    links = getDataFile("links.json")
    list = {"nodes": nodes, "links": links}
    return HttpResponse(json.dumps(list, ensure_ascii=False), content_type="application/json")

def getAllPv(request):
    nodes = getDataFile("nodes.json")
    list = [elem for elem in nodes if elem["type"]=="pv"]
    return HttpResponse(json.dumps(list, ensure_ascii=False), content_type="application/json")

def getIoc(request):
    nodes = getDataFile("nodes.json")
    list = [elem for elem in nodes if elem["type"]=="ioc"]
    return HttpResponse(json.dumps(list, ensure_ascii=False), content_type="application/json")

def getPvByPv(request):
    try:
        data = request.GET
        pv_name = data['pv']
        nodes = getDataFile("nodes.json")
        links = getDataFile("links.json")
        pv_names = []
        for elem in links:
            if elem["type"] == "ref":
                if elem["source"] == pv_name:
                    pv_names.append(elem["target"])
                elif elem["target"] == pv_name:
                    pv_names.append(elem["source"])
        list = [elem for elem in nodes if elem["type"]=="pv" and elem["id"] in pv_names]
    except Exception as e:
        print e
    return HttpResponse(json.dumps(list, ensure_ascii=False), content_type="application/json")

def getPvByIoc(request):
    try:
        data = request.GET
        ioc_name = data['ioc']
        nodes = getDataFile("nodes.json")
        links = getDataFile("links.json")
        pv_names = [elem['target'] for elem in links if elem["type"]=="has" and elem["source"]==ioc_name]
        list = [elem for elem in nodes if elem["type"]=="pv" and elem["id"] in pv_names]
    except Exception as e:
        print e
    return HttpResponse(json.dumps(list, ensure_ascii=False), content_type="application/json")

def getInfoIoc(request):
    data = request.GET
    ioc_name = data['ioc']
    nodes = getDataFile("nodes.json")
    links = getDataFile("links.json")
    result = {}
    pv_names = [elem['target'] for elem in links if elem["type"]=="has" and elem["source"]==ioc_name]
    result["pv_list"] = [elem for elem in nodes if elem["type"]=="pv" and elem["id"] in pv_names]
    result["pv_links"] = []
    result["connected_pv"] = []
    result["ioc_links"] = []
    result["ioc"] = []
    ioc_names = []
    connected_pv_names = []
    for elem in links:
        if elem["type"]=="ref":
            if elem["source"] in pv_names:
                result["pv_links"].append(elem)
                result["connected_pv"].append(next(n for n in nodes if n["id"] == elem["target"]))
                connected_pv_names.append(elem["target"])
            elif elem["target"] in pv_names:
                result["pv_links"].append(elem)
                result["connected_pv"].append(next(n for n in nodes if n["id"] == elem["source"]))
                connected_pv_names.append(elem["source"])
    for elem in links:
        if elem["type"]=="has" and elem["target"] in connected_pv_names:
            result["ioc_links"].append(elem)
            if elem["source"] not in ioc_names:
                ioc_names.append(elem["source"])
    for elem in ioc_names:
        result["ioc"].append(next(n for n in nodes if n["id"] == elem))
    return HttpResponse(json.dumps(result, ensure_ascii=False), content_type="application/json")


def getDataFile(name):
    with open(os.path.dirname(os.path.abspath(__file__))+'/data/'+name) as data_file:
        data = json.load(data_file)
    return data