"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequirePermissions = exports.PERMISSIONS_KEY = void 0;
var common_1 = require("@nestjs/common");
// Custom decorator mapped exactly to legacy permission types: read, add, edit, delete, printx, confirm, upload
exports.PERMISSIONS_KEY = 'permissions';
var RequirePermissions = function (moduleName, action) {
    return (0, common_1.SetMetadata)(exports.PERMISSIONS_KEY, { module: moduleName, action: action });
};
exports.RequirePermissions = RequirePermissions;
