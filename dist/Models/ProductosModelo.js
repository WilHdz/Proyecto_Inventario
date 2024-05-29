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
exports.obtenerProductos = exports.crearProducto = void 0;
const DataBase_1 = __importDefault(require("../Utils/DataBase"));
const crearProducto = (producto) => __awaiter(void 0, void 0, void 0, function* () {
    const query = 'INSERT INTO Productos (nombre, descripcion, precio, cantidad) VALUES (?, ?, ?, ?)';
    const { nombre, descripcion, precio, cantidad } = producto;
    yield DataBase_1.default.execute(query, [nombre, descripcion, precio, cantidad]);
});
exports.crearProducto = crearProducto;
const obtenerProductos = () => __awaiter(void 0, void 0, void 0, function* () {
    const [rows] = yield DataBase_1.default.execute('SELECT * FROM Productos');
    return rows;
});
exports.obtenerProductos = obtenerProductos;
