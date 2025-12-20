document.addEventListener('DOMContentLoaded', init)

//leaflet map
function init(){
    const map = L.map('map').setView([ 18.46, -69.93], 14)
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

//Fetch API  - GET request
const fetchGetRequest = async (url, funcion) => {
    try {
        const respuesta = await fetch (url)
        const jason = await respuesta.json()
        return funcion(jason)
    } catch (error){
        console.log(error.message)
    }
    
}

const pointStyle = { //Una ves declarada una variable como const su valor no puede cambiar si se usa el operador ()=) en otra operacion
    stroke : true,
    radious : 11,
    color : 'black',
    weight : 2,
    opacity : 1,
    fillColor : 'green',
    fillOpacity : 1,
}

const selectedPointStyle = {
    stroke : true,
    radious : 11,
    color : 'black',
    weight : 2,
    opacity : 1,
    fillColor : 'white',
    fillOpacity : 1,
}



stylesGeoJSONOnClick = (lugares) =>{
    let lastClickedFeature; // Cuando se define una variable como let, puede ser usada solo localmente dentro del margen{} declarada
    lugares.on ('click', e =>{
        if (lastClickedFeature){
            lugares.resetStyle(lastClickedFeature)
        }
        lastClickedFeature = e.layer
        e.layer.setStyle(selectedPointStyle)
    })

}

//Agregando las tres ciudades mas cercanas al lugar seleccionado
var nearByCitiesGeoJSONLayer;
const addNearByCities = (geoJSON) => {
    if(nearByCitiesGeoJSONLayer){
        map.removeLayer(nearByCitiesGeoJSONLayer)
    }

    nearByCitiesGeoJSONLayer = L.geoJSON(geoJSON, {
        onEachFeature: (feature, layer) =>{
            let nombreCiudad = feature.properties.nombre;
            let proximidad = feature.properties.proximidad;
            let redProximidad = proximidad.toFixed(2);
            layer.bindPopup(`Nombre de la ciudad: ${nombreCiudad}, </br> proximidad: ${redProximidad} km`)
        }
    }).addTo(map)
}

//Add nearby cities logic
const addNearByCitiesLogic = (id) =>{
    let url = `http://127.0.0.1:8000/api/v1/ciudades/?placeid=${id}`;
    fetchGetRequest(url, addNearByCities)//mi funcion fetchGetRequest que recibe url y funcion
}


const placeImageElement = document.getElementById('imagenlugar');
const menuTextElement = document.getElementById('menu_text');
const menuTitleElement = document.getElementById('menu_title');


onEachFeatureHandler = (feature, layer) =>{ //feature me permite manejar los elementos geograficos guardados en la base de datos
    let nombreLugar = feature.properties.nombre_lugar
    layer.bindPopup (`El nombre de este lugar es: <br/><center><b>${nombreLugar}</b></center>`)
    
    let imagenNoDisponible = './media/imagen_lugares/imagen_no_disponible.jpg'

    layer.on('click', (e) => {// layer me permite manejar los elementos en la capa del mapa(poligonos, lines, etc)
        let featureImage = feature.properties.campo_imagen ? feature.properties.campo_imagen: imagenNoDisponible
        let featureDescription = feature.properties.descripcion

        menuTitleElement.innerHTML = `Nombre del lugar popular de la comunidad: ${nombreLugar}`;
        placeImageElement.setAttribute ('src', featureImage);
        menuTextElement.innerHTML = featureDescription;

        let featureID = feature.properties.pk;
        addNearByCitiesLogic(featureID)

    })
}




////////////// latlng no esta siendo reconocida
const zoomMarker = 16;
circleMarkerHandler = ( latlng, pointStyle) => {
        const zoom = map.getZoom();
        let todosMarcadores;
        if (zoomMarker >= zoom && todosMarcadores){
            map.removeLayer(todosMarcadores)
        }

            todosMarcadores = L.geoJSON(json,{
            pointToLayer: function(feature, latlng){
                return L.circleMarker(latlng, pointStyle)
            }
        })//addTo(map)
}



const addAllPlacesToMap = (json) => {
    let lugares = L.geoJSON(json, { // L.geoJSON es una funcion de la biblioteca L debe ser declarado sin error ortografico
        pointToLayer: function(feature, latlng){
            return L.circleMarker (latlng, pointStyle) //circleMarker es una funcion de la biblioteca L
            const zoom = map.getZoom();
            let misMarcadores =  L.circleMarker (latlng, pointStyle);
            if ( zoom < zoomMarker  ){
                map.removeLayer(misMarcadores)
            } else if(zoom >= zoomMarker){
            
             }
        },
        onEachFeature: (feature,layer) => { //onEachFeature es una una funcion de la biblioteca Leaflet
            onEachFeatureHandler(feature, layer)
            //circleMarkerHandler(layer, pointStyle)
        }
    }).addTo(map)
 
    stylesGeoJSONOnClick(lugares); 
    
}



fetchGetRequest('api/v1/lugares', addAllPlacesToMap)



//SECCION AGREGAR GEOJSON ESTATICO A MAPA

var layername;
 function fetchData(url, layername){
    fetch(url, {
      method:'GET',
      mode: 'same-origin'
  })
      .then(function(response){
          if (response.status === 200){
              return response.json(response)
          } else {
              throw new Error('Fetch API could not fetch the data')
          }
      })
      .then(function(geojson){
          addGeoJSONData(geojson, layername) //Para layername revisar geojson part 3 minuto 4
      })
      .catch(function(error){
          console.log(error)
      }) 
  }


function addGeoJSONData(data, layername){
      
    let geoJSONLayer = L.geoJSON(data,{
            onEachFeature: function (feature, layer) {
            // Bind a label directly on top of the geometric feature 
            layer.bindTooltip(feature.properties.name, { // Crea un recuadro que muestra el nombre del poligono
                                                        //En el corchete puede agregarle propiedades incluso de html a tooltip
                permanent: true,        // Keep label always visible
                direction: 'center',    // Position the label in the center of the shape
                className: 'geojson-label',  // Custom class for styling //Para manejar en archivo css
                padding: 0,
                //opacity: 0.3,  
            });
        },      


    }).addTo(map) // Funcion tomada de proyecto anterior con modificaciones
    geoJSONLayer.bindPopup(function(layer){ //Al hacer clic en el poligono saldra un popup con el nombre del poligono
        return layer.feature.properties.name;
    })

    const minZoomToShow = 16;
    //Polygon Style
    var PolygonStyle = {
    color: 'orange',
    fillColor: 'orange',
    fillOpacity: 0.5
    }

    function updateGeoJSONTooltips() {
        const zoom = map.getZoom();
        geoJSONLayer.eachLayer(layer => {
          if (layer.getTooltip && layer.getTooltip()) {
            if (zoom < minZoomToShow && layer.isTooltipOpen()) {
              layer.closeTooltip();
            } else if (zoom >= minZoomToShow && !layer.isTooltipOpen()) {
              layer.openTooltip();
            }
          }
        });
    }

    function updatePolygonStyle() {
        const zoom = map.getZoom();
        if (zoom < minZoomToShow) {
            geoJSONLayer.setStyle({
            color: 'transparent',
            fillColor: 'transparent',
            fillOpacity: 0
            });
        } else {
            geoJSONLayer.setStyle(PolygonStyle);
        }
    }

     map.on('zoomend', updatePolygonStyle);
     map.on('zoomend', updateGeoJSONTooltips);

     //updateGeoJSONTooltips();


}           //End of ADDGeoJson function



  //Implementando controles del mapa
  L.control.scale({
    imperial: false
  }).addTo(map); //Para mostrar altura en metros en esquina inferior izquierda

  //Obteniendo la locacion del usuario
  map.locate({
    setView: true,
    maxZoom: 16
  })

   // Cuando se encuentra la locacion
   map.on ('locationfound', function(e){
    L.marker(e.latlng).addTo(map)
      .bindPopup(`Tu estas aqui: <br>Latitud: ${e.latlng.lat.toFixed(5)}<br>Longitud: ${e.latlng.lng.toFixed(5)}`)
    //.openPopup(); //Al encontrar mi locacion muestra un mensaje en pin
     
    L.circle(e.latlng, { radius: e.accuracy }).addTo(map); // Con esto se dibuja un circulo en el area donde me localizo
  });



fetchData('./static/geojson/comunidad.GeoJSON', 'MapaGirasoles')


}

/*const miAtribucion =  L.control.attribution ({ // Para mover mensaje de atribucion del mapa(creditos)
  position: 'bottomleft'
});

miAtribucion.addAttribution('Mi capa en cima');

miAtribucion.addTo(mymap);*/