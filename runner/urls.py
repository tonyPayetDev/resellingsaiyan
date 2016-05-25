# -*- coding: utf-8 -*-

# Copyright (C) 2014 Nerim (Philippe 'paHpa' Vivien)

from django.conf.urls import (  # noqa
    patterns, include, url,
)
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.core.exceptions import ImproperlyConfigured
from django.conf.urls.static import static
from django.contrib.auth.decorators import login_required



from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    url(r'^$', 'runner.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),
#    url(r"^account/", include("account.urls")),

    #pinax account
    url(r"^accounts/", include("account.urls")),
    
    url(r'^admin/doc/', include('django.contrib.admindocs.urls')), 
    url(r'^admin/', include(admin.site.urls)),
#    url(r'^example/', 'example.views.index'),   

    url(r'^blacklist/', include('blacklist.urls' , namespace='blacklist', app_name='blacklist')),
  
    url(r'^api/', include('api.urls', namespace='api')),


)

# PAHPA : LOAD URL 
#print "** PAHPA ** loadind url"
from django.conf import settings

#TEST DJANGO-REST
if 'rest_framework' in settings.INSTALLED_APPS:

    from rest_framework.authtoken import views
    from account.views import SettingsView
    
    urlpatterns += patterns('',
        url(r'^api-auth/', include('rest_framework.urls',
                               namespace='rest_framework')),
#        url(r'^api-token-auth/', views.obtain_auth_token), 

        #si utilisation djoser account (en test)
        #url(r'^auth/', include('djoser.urls')),

        #mapping pinax 'account'
        url(r"^accounts/profile/$", SettingsView.as_view(), name="account_settings"),
    )

if 'adminactions' in settings.INSTALLED_APPS:
    from django.contrib.admin import site
    import adminactions.actions as actions
    actions.add_to_site(site)

    urlpatterns += patterns('',
    (r'^adminactions/', include('adminactions.urls')),
    )
   
if 'xadmin' in settings.INSTALLED_APPS:
    import xadmin
    xadmin.autodiscover()
    
    urlpatterns += patterns('',
        url(r'^xadmin/', include(xadmin.site.urls)),
    )

if 'imagestore' in settings.INSTALLED_APPS:
    urlpatterns += patterns('',
        url(r'^gallery/', include('imagestore.urls', namespace='imagestore')),
    )
    
if 'rosetta' in settings.INSTALLED_APPS:
    urlpatterns += patterns('',
        url(r'^rosetta/', include('rosetta.urls')),
    )

if 'helpdesk' in settings.INSTALLED_APPS:
    urlpatterns += patterns('',
        url(r'helpdesk/', include('helpdesk.urls')),
    )

if 'wkhtmltopdf' in settings.INSTALLED_APPS:
    from wkhtmltopdf.views import PDFTemplateView
    urlpatterns += patterns('',
        url(r'^pdf/$', PDFTemplateView.as_view(template_name='billing/template.html',filename='my_pdf.pdf'), name='pdf'),
    )

#if 'docs' in settings.INSTALLED_APPS:
#    urlpatterns += patterns('',
#        url(r'^docs/', include('docs.urls')),
#    )

if 'sphinxdoc' in settings.INSTALLED_APPS:
    urlpatterns += patterns('',
        url(r'^docs/', include('sphinxdoc.urls')),
    )

if 'haystack' in settings.INSTALLED_APPS:
    urlpatterns += patterns('',
        url(r'^search/', include('haystack.urls'))
    )

#
#if 'dajaxice' in settings.INSTALLED_APPS:
#    from dajaxice.core import dajaxice_autodiscover, dajaxice_config
#    dajaxice_autodiscover()
#
#    urlpatterns += patterns('',
#        url(dajaxice_config.dajaxice_url, include('dajaxice.urls')),
#    )

#if 'admin_tools' in settings.INSTALLED_APPS:
#    urlpatterns += patterns('',
#        url(r'^admin_tools/', include('admin_tools.urls')),
#    )
#
if 'forms_builder.forms' in settings.INSTALLED_APPS:
    import forms_builder.forms.urls
    urlpatterns += patterns('',
        url(r'^forms/', include(forms_builder.forms.urls)),
    )

if 'demo' in settings.INSTALLED_APPS:
    urlpatterns += patterns('',
        url(r'^demo/', include('demo.urls')),
    )

if settings.DEBUG:
    if 'debug_toolbar' in settings.INSTALLED_APPS:
        import debug_toolbar
        urlpatterns += patterns('',
            url(r'^__debug__/', include(debug_toolbar.urls)),
        )

    urlpatterns += patterns('',
                    (r'^' + settings.MEDIA_URL[1:] + '(?P<path>.*)$', 'django.views.static.serve',
                    {'document_root': settings.MEDIA_ROOT, 'show_indexes': True}),
                    )
    urlpatterns += patterns('django.contrib.staticfiles.views',
        url(r'^static/(?P<path>.*)$', 'serve'),
    )
else:
# mettre en place un flag DJNGO_SERVE_STATIC
    urlpatterns += patterns('',
                    (r'^' + settings.MEDIA_URL[1:] + '(?P<path>.*)$', 'django.views.static.serve',
                    {'document_root': settings.MEDIA_ROOT, 'show_indexes': True}),
                    )
    urlpatterns += patterns('django.contrib.staticfiles.views',
        url(r'^static/(?P<path>.*)$', 'serve'),
    )
    
handler404 = 'runner.views.my_custom_404_view'

