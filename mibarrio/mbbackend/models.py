from django.db import models
from django.contrib.gis.db import models

# Create your models here.
class Categoria (models.Model):
    nombre_categoria = models.Charfield()