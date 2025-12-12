from .models import Categoria, Ciudad, Lugar
from rest_framework import serializers
from rest_framework_gis.serializers import GeoFeatureModelSerializer


class SerializadorCategoria(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = '__all__'

class SerializadorLugar(GeoFeatureModelSerializer):
    categorias = serializers.SlugRelatedField (queryset = Categoria.objects.all(), slug_field='nombre_categoria')

    class Meta:
        model = Lugar
        geo_field = 'punt_geom'

        fields = (
            'pk',
            'categorias',
            'nombre_lugar',
            'descripcion',
            'campo_imagen',
            'creado_en',
            'modificado_en'
        )

class SerializadorCiudades(GeoFeatureModelSerializer):
    proximidad = serializers.SerializerMethodField('get_proximidad')

    def get_proximidad (self, obj):
        if obj.distancia: #Esta variable distancia obtiene asignacion en el view al utilizar extension Distance
            return obj.distancia.km
        return False
    
    class Meta:
        model = Ciudad
        geo_field= 'punt_geom' #Por lo visto es necesario nombrarlo geo_field o provoca un error

        fields = (
            'pk',
            'nombre',
            'proximidad'
        )
