# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render
from django.http import HttpResponse#, HttpResponseRedirect
#from django.template import RequestContext

#from io import BytesIO
from . import tf_dep, models
import json

def index(request):
    return render(request, 'index.html')
    
def predict(request):
    if request.method=='POST':
        image_data = request.FILES['imgInp']
        img_bytes = image_data.file
        results = tf_dep.predict_image_class(img_bytes.getvalue())
        models.Image.objects.create(img=image_data, water=results['water']) # create and save in a single step
        results_str = json.dumps(results)
        return HttpResponse(results_str)