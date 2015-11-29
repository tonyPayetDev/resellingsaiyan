from django.db import models
from django.utils.encoding import python_2_unicode_compatible


@python_2_unicode_compatible
class myfieldSaiyan(models.Model):    
    typeSaiyan = models.CharField(blank=True, null=True,max_length=200)
    name = models.CharField(max_length=200)
    label = models.CharField(max_length=200)

    class Meta:
        verbose_name = 'myfieldSaiyan'

    def __str__(self):
        return self.name
        
@python_2_unicode_compatible
class configSaiyan(models.Model):
    namepage = models.CharField(max_length=200)
    urlrest = models.CharField(max_length=200)
    url = models.CharField(max_length=200)
    dom = models.CharField(max_length=200)
    field = models.ManyToManyField(myfieldSaiyan)

    class Meta:
        verbose_name = 'configSaiyan'
    
    def __str__(self):              # __unicode__ on Python 2
        return self.namepage
        
