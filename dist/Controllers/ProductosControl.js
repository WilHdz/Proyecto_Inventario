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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProductos = exports.createProducto = void 0;
const ProductosModelo_1 = require("../Models/ProductosModelo");
const index_1 = require("../index");
const createProducto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nombre, descripcion, precio, cantidad } = req.body;
        yield (0, ProductosModelo_1.crearProducto)({ nombre, descripcion, precio, cantidad });
        (0, index_1.notificarActualizacionProductos)();
        res.status(201).json({ mensaje: 'Producto creado exitosamente' });
    }
    catch (error) {
        console.error('Error al crear producto:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});
exports.createProducto = createProducto;
const getProductos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productos = yield (0, ProductosModelo_1.obtenerProductos)();
        res.status(200).json(productos);
    }
    catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});
exports.getProductos = getProductos;
