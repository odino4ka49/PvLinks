from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^getPvData', views.getPvData, name='pv-data'),
    url(r'^getIoc', views.getIoc, name='ioc-data'),
    url(r'^getInfoIoc', views.getInfoIoc, name='ioc-info'),
    url(r'^pvlist/(?P<id>[-@\w]+)$', 'pvlinks.views.pvlist', name="index-pvlist"),
]

