from django.contrib.gis import admin
from .models import Categoria, Lugar, Ciudad

# Register your models here.
admin.site.register(Categoria)


class CustomGeoAdmin(admin.GISModelAdmin):
    gis_widget_kwargs = {
        'attrs':{
            'default_zoom': 11,
            'default_lon': -69.93,
            'default_lat': 18.43,
        }
    }


@admin.register(Lugar)
class LugarAdmin(CustomGeoAdmin):
    pass

@admin.register(Ciudad)
class CiudadAdmin(CustomGeoAdmin):
    pass