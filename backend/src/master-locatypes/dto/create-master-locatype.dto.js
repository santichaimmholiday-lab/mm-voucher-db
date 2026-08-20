"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateMasterLocatypeDto = exports.CreateMasterLocatypeDto = void 0;
var class_validator_1 = require("class-validator");
var swagger_1 = require("@nestjs/swagger");
var CreateMasterLocatypeDto = function () {
    var _a;
    var _locatype_code_decorators;
    var _locatype_code_initializers = [];
    var _locatype_code_extraInitializers = [];
    var _locatype_name_decorators;
    var _locatype_name_initializers = [];
    var _locatype_name_extraInitializers = [];
    var _locatype_desc_decorators;
    var _locatype_desc_initializers = [];
    var _locatype_desc_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateMasterLocatypeDto() {
                this.locatype_code = __runInitializers(this, _locatype_code_initializers, void 0);
                this.locatype_name = (__runInitializers(this, _locatype_code_extraInitializers), __runInitializers(this, _locatype_name_initializers, void 0));
                this.locatype_desc = (__runInitializers(this, _locatype_name_extraInitializers), __runInitializers(this, _locatype_desc_initializers, void 0));
                __runInitializers(this, _locatype_desc_extraInitializers);
            }
            return CreateMasterLocatypeDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _locatype_code_decorators = [(0, swagger_1.ApiProperty)({ description: 'Locatype Code (e.g. HOTEL, TOUR)' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _locatype_name_decorators = [(0, swagger_1.ApiProperty)({ description: 'Locatype Name (e.g. Hotel, Tour/Transfer)' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _locatype_desc_decorators = [(0, swagger_1.ApiProperty)({ description: 'Locatype Description', required: false }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _locatype_code_decorators, { kind: "field", name: "locatype_code", static: false, private: false, access: { has: function (obj) { return "locatype_code" in obj; }, get: function (obj) { return obj.locatype_code; }, set: function (obj, value) { obj.locatype_code = value; } }, metadata: _metadata }, _locatype_code_initializers, _locatype_code_extraInitializers);
            __esDecorate(null, null, _locatype_name_decorators, { kind: "field", name: "locatype_name", static: false, private: false, access: { has: function (obj) { return "locatype_name" in obj; }, get: function (obj) { return obj.locatype_name; }, set: function (obj, value) { obj.locatype_name = value; } }, metadata: _metadata }, _locatype_name_initializers, _locatype_name_extraInitializers);
            __esDecorate(null, null, _locatype_desc_decorators, { kind: "field", name: "locatype_desc", static: false, private: false, access: { has: function (obj) { return "locatype_desc" in obj; }, get: function (obj) { return obj.locatype_desc; }, set: function (obj, value) { obj.locatype_desc = value; } }, metadata: _metadata }, _locatype_desc_initializers, _locatype_desc_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateMasterLocatypeDto = CreateMasterLocatypeDto;
var UpdateMasterLocatypeDto = /** @class */ (function (_super) {
    __extends(UpdateMasterLocatypeDto, _super);
    function UpdateMasterLocatypeDto() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return UpdateMasterLocatypeDto;
}(CreateMasterLocatypeDto));
exports.UpdateMasterLocatypeDto = UpdateMasterLocatypeDto;
