"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
var common_1 = require("@nestjs/common");
var serve_static_1 = require("@nestjs/serve-static");
var path_1 = require("path");
var prisma_module_1 = require("./prisma/prisma.module");
var master_locatypes_module_1 = require("./master-locatypes/master-locatypes.module");
var master_locations_controller_1 = require("./master-locations/master-locations.controller");
var master_locations_service_1 = require("./master-locations/master-locations.service");
var customers_controller_1 = require("./customers/customers.controller");
var customers_service_1 = require("./customers/customers.service");
var vouchers_controller_1 = require("./vouchers/vouchers.controller");
var vouchers_service_1 = require("./vouchers/vouchers.service");
var auth_controller_1 = require("./auth/auth.controller");
var auth_service_1 = require("./auth/auth.service");
var settings_module_1 = require("./settings/settings.module");
var AppModule = function () {
    var _classDecorators = [(0, common_1.Module)({
            imports: [
                serve_static_1.ServeStaticModule.forRoot({
                    rootPath: (0, path_1.join)(process.cwd(), 'uploads'),
                    serveRoot: '/uploads',
                }),
                prisma_module_1.PrismaModule,
                master_locatypes_module_1.MasterLocatypesModule,
                settings_module_1.SettingsModule
            ],
            controllers: [
                master_locations_controller_1.MasterLocationsController,
                customers_controller_1.CustomersController,
                vouchers_controller_1.VouchersController,
                auth_controller_1.AuthController
            ],
            providers: [
                master_locations_service_1.MasterLocationsService,
                customers_service_1.CustomersService,
                vouchers_service_1.VouchersService,
                auth_service_1.AuthService
            ],
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var AppModule = _classThis = /** @class */ (function () {
        function AppModule_1() {
        }
        return AppModule_1;
    }());
    __setFunctionName(_classThis, "AppModule");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AppModule = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AppModule = _classThis;
}();
exports.AppModule = AppModule;
