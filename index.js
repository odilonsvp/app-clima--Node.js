require('dotenv').config();

const {leerInput, inquirerMenu, pausa, listarLugares} = require('./helpers/inquirer');
const Busquedas = require('./models/busquedas');

const main = async() => {
    console.clear();
    const busquedas = new Busquedas();
    let option;
    
    do {
        option = await inquirerMenu();
        
        switch (option) {
            case 1:
                // Mostrar mensaje
                const termino = await leerInput('Ciudad: ');

                // Buscar lugares
                const lugares = await busquedas.ciudad(termino);

                // Seleccionar lugar
                const id = await listarLugares(lugares);
                if (id === '0') continue;

                const lugarSeleccionado = lugares.find( lugar => lugar.id === id);
                
                // Guardar en DB
                busquedas.agregarHistorial(lugarSeleccionado.nombre);
                
                // Consultar clima
                const clima = await busquedas.climaLugar(lugarSeleccionado.lat, lugarSeleccionado.lng);

                console.log('Datos de la Ciudad\n'.green);
                console.log('Ciudad :', lugarSeleccionado.nombre);
                console.log('Lat:', lugarSeleccionado.lat);
                console.log('Lon:', lugarSeleccionado.lng);
                console.log('Temperatura:', clima.temp);
                console.log('Minima:', clima.min);
                console.log('Maxima:', clima.max);
                console.log('condiciones: ', clima.desc)

            break;

            case 2:
                busquedas.historialCapitalizado.forEach((lugar, i) => {
                    const idx = `${i + 1}.`.green;
                    console.log(`${idx} ${lugar}`);
                })
            break;

            case 3:
            break;
        }

        if (option!==0) await pausa();

    } while (option !==0); 
}

main();