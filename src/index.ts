 import express from 'express';
import bodyParser from 'body-parser';
import http from 'http';
import WebSocket from 'ws';
import dotenv from 'dotenv';
import router from './Routes/routes';
import cors from 'cors'; 
import { obtenerProductos } from './Models/ProductosModelo';
import { getAllUsuarios  } from './Models/UsuariosModelo';
import { crearUsuario } from './Models/UsuariosModelo';
import { obtenerTransacciones } from './Models/TransaccionesModelo';
import EventEmitter from 'events';

dotenv.config();

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const PORT = process.env.PORT || 3000;

const transaccionesEmitter = new EventEmitter();
const clientesLongPolling = new Set();

app.use(cors()); 
app.use(bodyParser.json());

app.use('/api', router);

app.get('/api/productos', async (req, res) => {
  const productos = await obtenerProductos();
  res.status(200).json(productos);
});

// Short Polling
app.get('/api/short-polling', async (req, res) => {
  console.log("solicitud recibidaa short-polling");
  const productos = await obtenerProductos();
  res.status(200).json(productos);
});

// Long Polling
app.get('/api/long-polling', async (req, res) => {
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Connection', 'keep-alive');

  const clientId = Date.now();
  clientesLongPolling.add(clientId);

  req.on('close', () => {
    clientesLongPolling.delete(clientId);
    console.log(`Cliente ${clientId} desconectado`);
  });

  transaccionesEmitter.once(`actualizacion-${clientId}`, async () => {
    const transacciones = await obtenerTransacciones();
    res.write(`data: ${JSON.stringify(transacciones)}\n\n`);
  });
  
});

export const notificarActualizaciontransacciones = async () => {
  const transacciones = await obtenerTransacciones();
  clientesLongPolling.forEach((clientId) => {
    transaccionesEmitter.emit(`actualizacion-${clientId}`, transacciones);
  });
};
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});



server.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
wss.on('connection', (ws) => {
  console.log('Cliente conectado');

  ws.on('message', (data) => {
    try {
      console.log('Datos recibidos:', data.toString());
      const dataJson = JSON.parse(data.toString());
      console.log('Datos analizados:', dataJson);

      switch (dataJson.action) {
        case 'getUsuarios':
          getAllUsuarios().then(usuarios => {
            ws.send(JSON.stringify({ event: 'getUsuarios', data: usuarios }));
          }).catch(error => {
            console.error('Error al obtener usuarios:', error);
            ws.send(JSON.stringify({ error: 'Error al obtener usuarios' }));
          });
          break;
        case 'createUsuario':
          const { nombre, email, contraseña } = dataJson.data;
          crearUsuario({ nombre, email, contraseña }).then(() => {
            getAllUsuarios().then(usuarios => {
              ws.send(JSON.stringify({ event: 'usuarioCreado', data: usuarios }));
              wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                  client.send(JSON.stringify({ event: 'usuarioCreado', data: usuarios }));
                }
              });
            }).catch(error => {
              console.error('Error al obtener usuarios:', error);
              ws.send(JSON.stringify({ error: 'Error al obtener usuarios' }));
            });
          }).catch(error => {
            console.error('Error al crear usuario:', error);
            ws.send(JSON.stringify({ error: 'Error al crear usuario' }));
          });
          break;
        default:
          ws.send(JSON.stringify({ error: 'Acción no válida' }));
      }
    } catch (error) {
      console.error('Error al analizar los datos recibidos:', error);
      console.error('Datos recibidos:', data.toString());
      ws.send(JSON.stringify({ error: 'Datos no válidos' }));
    }
  });

  ws.on('close', () => {
    console.log('Cliente desconectado');
  });
});
