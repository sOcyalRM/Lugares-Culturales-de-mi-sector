from django.shortcuts import render

# Create your views here.
def listaLugaresMap(request):
    return render (request, 'mbfrontend/mibarrio_base.html')
    