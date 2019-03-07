/*
    Test para banner sinusoidal creado por Josep Antoni Bover Comas el 06-09-2016    

        Vista por defecto en el Laboratorio de pruebas  
		devildrey33_Lab->Opciones->Vista = Filas;

        Ultima modificación el 07/03/2019
*/
// Constructor
var Banner_Sinusoidal = function() {    
    // Llamo al constructor del ObjetoBanner
    if (ObjetoCanvas.call(this, { 
        'Tipo'              : '2d',
        'Ancho'             : 'Auto',
        'Alto'              : 'Auto',
        'Entorno'           : 'Normal',
        'MostrarFPS'        : true,
        'BotonLogo'         : true,
        'BotonesPosicion'   : "derecha",                        // alineado al borde inferior izquierda
        'BotonExtraHTML'    : '<div class="ObjetoCanvas_Boton" title="Nuevos valores aleatórios" onclick="Canvas.Reiniciar()"><span style="display:table; margin-top:19px; margin-left:auto; margin-right:auto">Rand</span></div>',
        'Pausar'            : false,                            // Pausa el canvas si la pestaña no tiene el foco del teclado        
        'ElementoRaiz'      : "",
        'CapturaEjemplo'    : "Sinusoidal.png"                  // Captura de pantalla para el ejemplo a "NuevoCanvas2D.png" se le añadirá "https://devildrey33.es/Web/Graficos/250x200_"
    }) === false) { return false; }
};


Banner_Sinusoidal.prototype = Object.assign( Object.create(ObjetoCanvas.prototype), {
    constructor     : Banner_Sinusoidal,
    
    Avance2         : 0,
    // Función que se llama al redimensionar el documento
    Redimensionar   : function() {  this.Reiniciar();  },
    // Función que se llama al hacer scroll en el documento    
    Scroll          : function() {    },
    // Función que se llama al mover el mouse por el canvas
    MouseMove       : function(Evento) { },
    // Función que se llama al entrar con el mouse en el canvas
    MouseEnter      : function(Evento) {  },
    // Función que se llama al salir con el mouse del canvas
    MouseLeave      : function(Evento) {  },
    // Array de circulos
    Circulos        : [],
    
    Iniciar         : function() {
        // Esconde la ventana que informa al usuario de que se está cargando la animación. (REQUERIDO)
        this.Cargando(false);
        this.Reiniciar();
    },
            
    // Función que crea los circulos, se puede especificar un array con los tamaños de cada circulo, si no se especifica nada, será aleatorio
    // Está calculado para un máximo de 10 circulos, y en teoría la onda no deberia salirse de la pantalla (aunque alguna vez se sale por poco.. 1 o 2 pixeles)
    CrearCirculos   : function(ArrayCirculos) {
        var TotalCirculos = RandInt(10, 4);        
        this.Circulos = [];
        if (typeof(ArrayCirculos) === "undefined") { // No hay array predefinido 
            var cAlpha = 1 - (TotalCirculos / 10);            
            for (var i = 0; i < TotalCirculos; i++) {                
                this.Circulos.push(new this.Circulo(RandInt((this.Alto / TotalCirculos) - 2, 15), 
                    "rgb(" + Math.floor(234 * cAlpha) + "," + Math.floor(80 * cAlpha) + "," + Math.floor(78 * cAlpha) + ")",
                    "rgb(" + Math.floor(255 * cAlpha) + "," + Math.floor(155 * cAlpha) + "," + Math.floor(155 * cAlpha) + ")"
                ));
                cAlpha += 0.1;
            }
        }
        else {
            var cAlpha = 1 - (ArrayCirculos.length / 10);
            for (var i = 0; i < ArrayCirculos.length; i++) {
                this.Circulos.push(new this.Circulo(ArrayCirculos[i], 
                    "rgb(" + Math.floor(234 * cAlpha) + "," + Math.floor(80 * cAlpha) + "," + Math.floor(78 * cAlpha) + ")",
                    "rgb(" + Math.floor(255 * cAlpha) + "," + Math.floor(155 * cAlpha) + "," + Math.floor(155 * cAlpha) + ")"
                ));
                cAlpha += 0.1;
            }
        }
        // Posición del circulo central
        this.Circulos[0].X = this.PosXCirculoCentral; // 
        this.Circulos[0].Y = this.Alto / 2;
        
        this.Circulos[this.Circulos.length - 1].Color = "rgb(234, 80, 78)";
    },
    
    // Objeto que representa un circulo
    Circulo : function(Tam, Color, ColorPunto) {
        this.Tam = Tam;
        this.X = 0;
        this.Y = 0;
        this.Color = Color;
        this.ColorPunto = ColorPunto;        
        // Función que calcula la posición del circulo basandose en el circulo padre
        this.Avance = function(Avance, CirculoPadre) {
            this.X = CirculoPadre.X + (Math.cos(Avance) * (CirculoPadre.Tam));
            this.Y = CirculoPadre.Y + (Math.sin(Avance) * (CirculoPadre.Tam));            
        };
    },
    
    // Función para reiniciar la animación
    Reiniciar       : function() { 
        this.DegradadoTranslucido_Ancho =  this.Ancho / 8;
        this.AnchoGrafico = this.Ancho - (this.Alto);
        this.PosXCirculoCentral = this.Ancho - (this.Alto / 2);
        
        // Color para el gráfico
        this.Color = "rgb(234, 80, 78)";
        this.ColorPuntos = "rgb(255, 155, 155)";
        // Degradado translucido para borrar la onda en la parte izquierda del banner
        this.DegradadoTranslucido = this.Context.createLinearGradient(0, 0, this.DegradadoTranslucido_Ancho, 0);
        this.DegradadoTranslucido.addColorStop(0, "rgba(49, 46, 53, 1)");
        this.DegradadoTranslucido.addColorStop(1, "rgba(49, 46, 53, 0)");
        
        if (Rand() > 0.5) {  this.Velocidad = (Math.PI * 2) / 180;     }
        else              {  this.Velocidad = -((Math.PI * 2) / 180);  }
        
//        this.CrearCirculos([60, 40, 30, 45]);
        this.CrearCirculos();
                
        // Creo un buffer para pintar toda la onda de punta a punta de la pantalla
        this.ImgOnda = new BufferCanvas((this.AnchoGrafico) + 360, this.Alto);
        this.ImgOnda.Context.strokeStyle = this.Color;    
       
        // Pinto la onda en el buffer 
        this.ImgOnda.Context.beginPath();
        this.ImgOnda.Context.moveTo(0, this.ImgOnda.Alto / 2);
        var Avance = 0;        
        
        for (var x = 0; x <= (this.AnchoGrafico) + 360; x++){
            Avance -= this.Velocidad;
            for (var i = 1; i < this.Circulos.length; i++) {
                this.Circulos[i].Avance(Avance * i, this.Circulos[i - 1]);
            }
            this.ImgOnda.Context.lineTo(x, this.Circulos[this.Circulos.length - 1].Y);
        }
        this.ImgOnda.Context.stroke();
        // Situo la posición inicial del backbuffer a la derecha
        this.Avance = -Math.floor(this.AnchoGrafico);
        this.Avance2 = 0;
    },
    
    
    // Función que pinta cada frame de la animación
    Pintar          : function() {    
        // El fondo
        this.Context.fillStyle = "rgba(49, 46, 53, 0.95)";
        this.Context.fillRect(0, 0, this.Ancho, this.Alto);
        // Pinto las líneas grises que determinan el centro del primer circulo
        this.Context.setLineDash([2.5]);
        this.Context.strokeStyle = "rgb(80, 80, 80)";                
        this.Context.beginPath();
        this.Context.moveTo(5, this.Alto / 2);
        this.Context.lineTo(this.Ancho - 5, this.Alto / 2);
        this.Context.stroke();
        this.Context.beginPath();
        this.Context.moveTo(this.PosXCirculoCentral, 5);
        this.Context.lineTo(this.PosXCirculoCentral, this.Alto - 5);
        this.Context.stroke();
        this.Context.setLineDash([1, 0]);        
        
        // Avance para el backbufer (en pixeles)
        this.Avance +=1;
        if (this.Avance >= 360) { this.Avance = 0; }
        this.Context.drawImage(this.ImgOnda.Canvas, this.Avance, 0, this.AnchoGrafico, this.Alto, 0, 0, this.AnchoGrafico, this.Alto);

        // Avance para los circulos
        this.Avance2 -= this.Velocidad;
        this.Context.fillStyle = this.ColorPunto;        
        // Calculo las posiciones de los circulos y los pinto
        for (var i = 0; i < this.Circulos.length; i++) {
            this.Context.strokeStyle = this.Circulos[i].Color;        
            this.Context.fillStyle = this.Circulos[i].ColorPunto;        
            if (i !== 0) { // No hay que calcular la posición del primer circulo porque es fijo.
                this.Circulos[i].Avance(this.Avance2 * i, this.Circulos[i - 1]);
                // Pinto el punto del eje
                this.Context.beginPath();
                this.Context.arc(this.Circulos[i].X, this.Circulos[i].Y, 2, 0, 2 * Math.PI);
                this.Context.fill();            
            }
            if (i !== this.Circulos.length - 1) { // En la ultima posición no se pinta el circulo (pertenece al ultimo eje de la barra que une los ciculos con el gráfico)
                this.Context.beginPath();
                this.Context.arc(this.Circulos[i].X, this.Circulos[i].Y, this.Circulos[i].Tam, 0, 2 * Math.PI);
                this.Context.stroke();
            }
            
        }
                
        
        // Barra que une el último circulo con el gráfico
        this.Context.beginPath();
        this.Context.moveTo(this.Circulos[i - 1].X, this.Circulos[i - 1].Y);
        this.Context.lineTo(this.AnchoGrafico, this.Circulos[i - 1].Y);
        this.Context.stroke();
        
        // Punto inicial de la barra desde la curva sinusoidal
        this.Context.beginPath();
        this.Context.arc(this.AnchoGrafico, this.Circulos[i - 1].Y, 2.5, 0, 2 * Math.PI);
        this.Context.fill();
        
        // Pinto un degradado para suavizar la parte izquierda del banner
        this.Context.fillStyle = this.DegradadoTranslucido;
        this.Context.fillRect(0, 0, this.DegradadoTranslucido_Ancho, this.Alto);        
    }
});

var Canvas = new Banner_Sinusoidal;
