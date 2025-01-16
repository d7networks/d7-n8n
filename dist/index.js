"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.D7Whatsapp = exports.D7Api = void 0;
const D7Api_node_1 = require("./nodes/D7Api/D7Api.node"); // Import your custom node
Object.defineProperty(exports, "D7Api", { enumerable: true, get: function () { return D7Api_node_1.D7Api; } });
const D7Whatsapp_node_1 = require("./nodes/D7Api/D7Whatsapp.node");
Object.defineProperty(exports, "D7Whatsapp", { enumerable: true, get: function () { return D7Whatsapp_node_1.D7Whatsapp; } });
