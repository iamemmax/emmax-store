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
require("dotenv/config");
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
require("colors");
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const category_route_1 = __importDefault(require("./routes/category/category.route"));
const products_route_1 = __importDefault(require("./routes/products/products.route"));
const Db_connection_1 = __importDefault(require("./config/Db.connection"));
const errorHandler_1 = require("./middlewares/errorHandler");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({ credentials: true }));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, morgan_1.default)("dev"));
app.use((0, cookie_parser_1.default)());
app.get('/', (req, res) => {
    res.send('Hello, p Express');
});
// routes
app.use("/api/users", user_routes_1.default);
app.use("/api/category", category_route_1.default);
app.use("/api/products", products_route_1.default);
//custom middlewares
app.use(errorHandler_1.notFound);
app.use(errorHandler_1.errorHandler);
// listening to port
const PORT = process.env.PORT;
(0, Db_connection_1.default)().then((res) => {
    app.listen(PORT, () => __awaiter(void 0, void 0, void 0, function* () {
        console.log(`server started on localhost:${PORT}`.red);
    }));
});
