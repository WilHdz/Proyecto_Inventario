"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificarActualizacionProductos = void 0;
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const http_1 = __importDefault(require("http"));
const ws_1 = __importDefault(require("ws"));
const dotenv_1 = __importDefault(require("dotenv"));
const routes_1 = __importDefault(require("./Routes/routes"));
const cors_1 = __importDefault(require("cors"));
const ProductosModelo_1 = require("./Models/ProductosModelo");
const ProductosModelo_2 = require("./Models/ProductosModelo");
const events_1 = __importDefault(require("events"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const wss = new ws_1.default.Server({ server });
const PORT = process.env.PORT || 3000;
const productosEmitter = new events_1.default();
const clientesLongPolling = new Set();
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.use('/api', routes_1.default);
app.get('/api/productos', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const productos = yield (0, ProductosModelo_1.obtenerProductos)();
    res.status(200).json(productos);
}));
// Short Polling
app.get('/api/short-polling', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("solicitud recibidaa short-polling");
    const productos = yield (0, ProductosModelo_1.obtenerProductos)();
    res.status(200).json(productos);
}));
// Long Polling
app.get('/api/long-polling', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Connection', 'keep-alive');
    const clientId = Date.now();
    clientesLongPolling.add(clientId);
    req.on('close', () => {
        clientesLongPolling.delete(clientId);
        console.log(`Cliente ${clientId} desconectado`);
    });
    productosEmitter.once(`actualizacion-${clientId}`, () => __awaiter(void 0, void 0, void 0, function* () {
        const productos = yield (0, ProductosModelo_1.obtenerProductos)();
        res.write(`data: ${JSON.stringify(productos)}\n\n`);
    }));
}));
const notificarActualizacionProductos = () => __awaiter(void 0, void 0, void 0, function* () {
    const productos = yield (0, ProductosModelo_1.obtenerProductos)();
    clientesLongPolling.forEach((clientId) => {
        productosEmitter.emit(`actualizacion-${clientId}`, productos);
    });
});
exports.notificarActualizacionProductos = notificarActualizacionProductos;
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
                (0, ProductosModelo_1.obtenerProductos)().then(productos => {
                    ws.send(JSON.stringify({ event: 'getProductos', data: productos }));
                }).catch(error => {
                    console.error('Error al obtener productos:', error);
                    ws.send(JSON.stringify({ error: 'Error al obtener productos' }));
                });
                break;
            case 'createProducto':
                const { nombre, descripcion, precio, cantidad } = dataJson.data;
                (0, ProductosModelo_2.crearProducto)({ nombre, descripcion, precio, cantidad }).then(() => {
                    (0, ProductosModelo_1.obtenerProductos)().then(productos => {
                        ws.send(JSON.stringify({ event: 'productoCreado', data: productos }));
                        wss.clients.forEach(client => {
                            if (client.readyState === ws_1.default.OPEN) {
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
