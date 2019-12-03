const { Board, Led, Thermometer } = require("johnny-five");
const board = new Board();

//Crendenciales para firebase
var admin = require("firebase-admin");
var serviceAccount = require("./serviceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://arquitectura-9c5fe.firebaseio.com"
});

board.on('ready', function() {
  //Se crea un objeto para controlar la base de datos
  let db = admin.firestore();
  //Se accede al documento en firebase
  let docRef = db.collection('data')
  //Fecha de hoy
  var today = new Date();
  /**
   * Se declara una variable para representar un sensor
   * de temperatura, en que pin esta conectado y 
   * se indica que cada 5 s realize una medicion
   */
  var thermometer = new Thermometer({
    controller: 'DS18B20',
    pin: 2,
    freq: 5000
  });

  //Se crea un led que esta conectado al pin 13
  var led = new Led({
    pin:13
  })
  
  thermometer.on('data', function() {
    /**
     * Cuando el sensor esta listo, se obtiene la fecha en formato YYYY-MM-DD
     * La hora en formato HH:MM:SS
     * Y por ultimo la temperatura en Celsius
     * El objeto que se crea tiene la forma:
     * {
     *  fecha: YYYY-MM-DD,
     *  hora: HH:MM:SS,
     *  temperatura: valor
     * }
     * Luego esta se guarda en la base de datos
     */
    docRef.add({
      fecha: today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate(),
      hora: today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds(),
      temperatura: this.celsius
    })
    //Si la temperatura es menor o igual a 27 celcius entonces enciende un led
    //(this.celsius <= 27) ? led.on() : led.off()
  });
});
