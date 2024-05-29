import express from 'express';
import bodyParser from 'body-parser';
import http from 'http';
import WebSocket from 'ws';
import dotenv from 'dotenv';
import router from './Routes/routes';
import cors from 'cors'; 
import { obtenerProductos } from './Models/ProductosModelo';
import { crearProducto } from './Models/ProductosModelo';
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
    const dataJson = JSON.parse(data.toString());

    switch (dataJson.action) {
      case 'getProductos':
        obtenerProductos().then(productos => {
          ws.send(JSON.stringify({ event: 'getProductos', data: productos }));
        }).catch(error => {
          console.error('Error al obtener productos:', error);
          ws.send(JSON.stringify({ error: 'Error al obtener productos' }));
        });
        break;
      case 'createProducto':
        const { nombre, descripcion, precio, cantidad } = dataJson.data;
        crearProducto({ nombre, descripcion, precio, cantidad }).then(() => {
          obtenerProductos().then(productos => {
            ws.send(JSON.stringify({ event: 'productoCreado', data: productos }));
            wss.clients.forEach(client => {
              if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ event: 'productoCreado', data: productos }));
              }
            });
          }).catch(error => {
            console.error('Error al obtener productos:', error);
            ws.send(JSON.stringify({ error: 'Error al obtener productos' }));
          });
        }).catch(error => {
          console.error('Error al crear producto:', error);
          ws.send(JSON.stringify({ error: 'Error al crear producto' }));
        });
        break;
      default:
        ws.send(JSON.stringify({ error: 'Acción no válida' }));
    }
  });

  ws.on('close', () => {
    console.log('Cliente desconectado');
  });
});