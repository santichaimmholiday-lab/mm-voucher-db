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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateMasterLocatypeDto = exports.CreateMasterLocatypeDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateMasterLocatypeDto {
    locatype_code;
    locatype_name;
    locatype_desc;
}
exports.CreateMasterLocatypeDto = CreateMasterLocatypeDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Locatype Code (e.g. HOTEL, TOUR)' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateMasterLocatypeDto.prototype, "locatype_code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Locatype Name (e.g. Hotel, Tour/Transfer)' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateMasterLocatypeDto.prototype, "locatype_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Locatype Description', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateMasterLocatypeDto.prototype, "locatype_desc", void 0);
class UpdateMasterLocatypeDto extends CreateMasterLocatypeDto {
}
exports.UpdateMasterLocatypeDto = UpdateMasterLocatypeDto;
//# sourceMappingURL=create-master-locatype.dto.js.map