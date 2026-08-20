"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MasterLocatypesModule = void 0;
const common_1 = require("@nestjs/common");
const master_locatypes_service_1 = require("./master-locatypes.service");
const master_locatypes_controller_1 = require("./master-locatypes.controller");
let MasterLocatypesModule = class MasterLocatypesModule {
};
exports.MasterLocatypesModule = MasterLocatypesModule;
exports.MasterLocatypesModule = MasterLocatypesModule = __decorate([
    (0, common_1.Module)({
        controllers: [master_locatypes_controller_1.MasterLocatypesController],
        providers: [master_locatypes_service_1.MasterLocatypesService],
    })
], MasterLocatypesModule);
//# sourceMappingURL=master-locatypes.module.js.map