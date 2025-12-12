from django.urls import path
from . import views

urlpatterns = [         #urlpatterns es la funcion nativa que maneja los urls, no puede haber error de sintaxis al escribirla
    path('categorias/', views.ListaCategoria.as_view(), name =views.ListaCategoria.name),
    path('categorias/<int:pk>/', views.DetalleCategoria.as_view(), name = views.DetalleCategoria.name),#el primary key(pk), esta
                                                                    #implicito en el modelo, no es necesario agregarlo a BD
    path('lugares/', views.ListaLugares.as_view(), name= views.ListaLugares.name),
    path('lugares/<int:pk>/', views.DetatalleLugares.as_view(), name = views.DetatalleLugares.name),
    path('ciudades/', views.ListaCiudades.as_view(), name=views.ListaCiudades.name),
]