"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MasterLocatypesController = void 0;
const common_1 = require("@nestjs/common");
const master_locatypes_service_1 = require("./master-locatypes.service");
const create_master_locatype_dto_1 = require("./dto/create-master-locatype.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const permissions_decorator_1 = require("../auth/decorators/permissions.decorator");
const swagger_1 = require("@nestjs/swagger");
let MasterLocatypesController = class MasterLocatypesController {
    masterLocatypesService;
    constructor(masterLocatypesService) {
        this.masterLocatypesService = masterLocatypesService;
    }
    create(createDto, req) {
        const userId = req.user['sub'];
        const ipAddress = req.ip;
        return this.masterLocatypesService.create(createDto, userId, ipAddress);
    }
    findAll() {
        return this.masterLocatypesService.findAll();
    }
    findOne(id) {
        return this.masterLocatypesService.findOne(id);
    }
    update(id, updateDto, req) {
        const userId = req.user['sub'];
        const ipAddress = req.ip;
        return this.masterLocatypesService.update(id, updateDto, userId, ipAddress);
    }
    remove(id, req) {
        const userId = req.user['sub'];
        const ipAddress = req.ip;
        return this.masterLocatypesService.remove(id, userId, ipAddress);
    }
};
exports.MasterLocatypesController = MasterLocatypesController;
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.RequirePermissions)('MasterLocatype', 'add'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_master_locatype_dto_1.CreateMasterLocatypeDto, Object]),
    __metadata("design:returntype", void 0)
], MasterLocatypesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, permissions_decorator_1.RequirePermissions)('MasterLocatype', 'view'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MasterLocatypesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, permissions_decorator_1.RequirePermissions)('MasterLocatype', 'view'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MasterLocatypesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, permissions_decorator_1.RequirePermissions)('MasterLocatype', 'edit'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_master_locatype_dto_1.UpdateMasterLocatypeDto, Object]),
    __metadata("design:returntype", void 0)
], MasterLocatypesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, permissions_decorator_1.RequirePermissions)('MasterLocatype', 'delete'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], MasterLocatypesController.prototype, "remove", null);
exports.MasterLocatypesController = MasterLocatypesController = __decorate([
    (0, swagger_1.ApiTags)('Master Locatypes'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('api/master-locatypes'),
    __metadata("design:paramtypes", [master_locatypes_service_1.MasterLocatypesService])
], MasterLocatypesController);
//# sourceMappingURL=master-locatypes.controller.js.map