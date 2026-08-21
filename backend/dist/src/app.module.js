"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const serve_static_1 = require("@nestjs/serve-static");
const path_1 = require("path");
const core_1 = require("@nestjs/core");
const prisma_module_1 = require("./prisma/prisma.module");
const master_locatypes_module_1 = require("./master-locatypes/master-locatypes.module");
const master_locations_controller_1 = require("./master-locations/master-locations.controller");
const master_locations_service_1 = require("./master-locations/master-locations.service");
const customers_controller_1 = require("./customers/customers.controller");
const customers_service_1 = require("./customers/customers.service");
const vouchers_controller_1 = require("./vouchers/vouchers.controller");
const vouchers_service_1 = require("./vouchers/vouchers.service");
const auth_controller_1 = require("./auth/auth.controller");
const auth_service_1 = require("./auth/auth.service");
const settings_module_1 = require("./settings/settings.module");
const jwt_auth_guard_1 = require("./auth/guards/jwt-auth.guard");
const app_controller_1 = require("./app.controller");
const users_controller_1 = require("./users/users.controller");
const users_service_1 = require("./users/users.service");
const jwt_1 = require("@nestjs/jwt");
const permissions_module_1 = require("./permissions/permissions.module");
const dashboard_module_1 = require("./dashboard/dashboard.module");
const audit_module_1 = require("./audit/audit.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            serve_static_1.ServeStaticModule.forRoot({
                rootPath: (0, path_1.join)(process.cwd(), 'uploads'),
                serveRoot: '/uploads',
            }),
            jwt_1.JwtModule.register({
                global: true,
                secret: 'SECRET_KEY_FOR_DEV',
                signOptions: { expiresIn: '4h' },
            }),
            prisma_module_1.PrismaModule,
            master_locatypes_module_1.MasterLocatypesModule,
            settings_module_1.SettingsModule,
            permissions_module_1.PermissionsModule,
            dashboard_module_1.DashboardModule,
            audit_module_1.AuditModule
        ],
        controllers: [
            master_locations_controller_1.MasterLocationsController,
            customers_controller_1.CustomersController,
            vouchers_controller_1.VouchersController,
            auth_controller_1.AuthController,
            app_controller_1.AppController,
            users_controller_1.UsersController
        ],
        providers: [
            master_locations_service_1.MasterLocationsService,
            customers_service_1.CustomersService,
            vouchers_service_1.VouchersService,
            auth_service_1.AuthService,
            users_service_1.UsersService,
            {
                provide: core_1.APP_GUARD,
                useClass: jwt_auth_guard_1.JwtAuthGuard,
            }
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map