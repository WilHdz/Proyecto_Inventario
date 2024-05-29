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
exports.getTransacciones = exports.createTransaccion = void 0;
const TransaccionesModelo_1 = require("../Models/TransaccionesModelo");
const createTransaccion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { tipo, id_producto, cantidad } = req.body;
        yield (0, TransaccionesModelo_1.crearTransaccion)({ tipo, id_producto, cantidad });
        res.status(201).json({ mensaje: 'Transacción creada exitosamente' });
    }
    catch (error) {
        console.error('Error al crear transacción:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});
exports.createTransaccion = createTransaccion;
const getTransacciones = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transacciones = yield (0, TransaccionesModelo_1.obtenerTransacciones)();
        res.status(200).json(transacciones);
    }
    catch (error) {
        console.error('Error al obtener transacciones:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});
exports.getTransacciones = getTransacciones;
