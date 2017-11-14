from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^getPvData', views.getPvData, name='pv-data'),
    url(r'^getIoc', views.getIoc, name='ioc-data'),
]

