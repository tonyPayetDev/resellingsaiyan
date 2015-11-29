from django import forms 
from lines.models import Telco 
from django.forms import ModelForm, Textarea
from valo.models import Juridiction 
from valo.models import Juridiction_Purchase, Juridiction_Selling

from lines.models import Telco

from crispy_forms.helper import FormHelper
from crispy_forms.layout import Layout
from crispy_forms.bootstrap import TabHolder, Tab


from crispy_forms.layout import Submit, Layout, Field
from crispy_forms.bootstrap import (
    PrependedText, PrependedAppendedText, FormActions)


class juriForm(forms.ModelForm):
    class Meta:
        model = Juridiction
   
        exclude = ('juriselling','siteid')  
        widgets = {
            'juripurchase': Textarea(attrs={'cols': 80, 'rows': 20}),
        }

class juriPurchase(forms.ModelForm):
   
   class Meta:
        model = Juridiction
        fields = ('juripurchase',)
      
