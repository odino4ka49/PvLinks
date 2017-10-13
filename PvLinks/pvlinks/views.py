from django.shortcuts import HttpResponse


def index(request):
    return HttpResponse("Hello, world.")


def getListData(request):
    return None
