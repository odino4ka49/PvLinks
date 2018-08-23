from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^getAllData', views.getAllData, name='all-data'),
    url(r'^getIoc', views.getIoc, name='ioc-data'),
    url(r'^getAllPv', views.getAllPv, name='allpv-data'),
    url(r'^getInfoIoc', views.getInfoIoc, name='ioc-info'),
    url(r'^getPvByIoc', views.getPvByIoc, name='pv-by-ioc-info'),
    url(r'^getPvByPv', views.getPvByPv, name='pv-by-pv-info'),
    url(r'^pvlist/(?P<id>[-@\w]+)$', 'pvlinks.views.pvlist', name="index-pvlist"),
    #url(r'^graph/(?P<id>[-@\w]+)$', 'pvlinks.views.graph', name="index-graph"),
]

