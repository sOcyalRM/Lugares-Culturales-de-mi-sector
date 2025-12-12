from .models import Lugar, Categoria, Ciudad
from .serializers import SerializadorCategoria, SerializadorLugar, SerializadorCiudades
from rest_framework import generics

from django.http import Http404
from django.contrib.gis.db.models.functions import Distance
from django.shortcuts import get_object_or_404


# Create your views here.

class ListaCategoria (generics.ListAPIView):
    queryset = Categoria.objects.all()
    serializer_class = SerializadorCategoria
    name = 'lista-categorias'

class DetalleCategoria(generics.RetrieveAPIView):
    queryset = Categoria.objects.all()
    serializer_class = SerializadorCategoria
    name = 'detalle-categorias'

class ListaLugares(generics.ListAPIView):
    queryset = Lugar.objects.filter(activo = True)
    serializer_class = SerializadorLugar
    name = 'lista-lugares'

class DetatalleLugares(generics.RetrieveAPIView):
    queryset = Lugar.objects.filter(activo = True)
    serializer_class = SerializadorLugar
    name = 'detalle-lugares'

class ListaCiudades(generics.ListAPIView):
    serializer_class = SerializadorCiudades
    name = 'lista-ciudades'

    def get_queryset(self):
        placeID = self.request.query_params.get('placeid')

        if placeID is None:
            raise Http404
        
        selectedPlaceGeom = get_object_or_404(Lugar, pk = placeID).punt_geom
        nearestCities = Ciudad.objects.annotate(distancia = Distance('punt_geom', selectedPlaceGeom)).order_by('distancia')[:3]
        return nearestCities