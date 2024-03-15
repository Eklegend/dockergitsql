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
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const morgan_1 = __importDefault(require("morgan"));
const sequelize_1 = require("sequelize");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
const sequelize = new sequelize_1.Sequelize(process.env.DB_NAME || 'database_name', process.env.DB_USER || 'database_username', process.env.DB_PASS || 'database_password', {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql'
});
console.log(process.env.DB_NAME);
console.log(process.env.DB_USER);
console.log(process.env.DB_PASS);
console.log(process.env.DB_HOST);
class Workers extends sequelize_1.Model {
}
Workers.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    text: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'Worker',
    tableName: 'Workers'
});
app.use(body_parser_1.default.json());
app.use((0, morgan_1.default)('dev'));
app.post('/worker', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { text } = req.body;
        if (!text) {
            return res.status(400).json({ error: 'Message text is required' });
        }
        const message = yield Workers.create({ text });
        return res.status(201).json(message);
    }
    catch (error) {
        console.error('Error writing message:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}));
app.get('/workers', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const messages = yield Workers.findAll();
        return res.json(messages);
    }
    catch (error) {
        console.error('Error fetching messages:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}));
// app.get('/hello', (req: express.Request, res: express.Response) => {
//     res.json({
//         status: true,
//         text  : 'hello world'
//     })
// })
app.listen(PORT, () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield sequelize.authenticate();
        console.log('Connection has been established successfully.');
        // Sync models with the database
        yield sequelize.sync();
        console.log('Models were synchronized successfully.');
    }
    catch (error) {
        console.error('Unable to connect to the database:', error);
    }
    console.log(`Server is running on port ${PORT}`);
}));
