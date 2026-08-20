"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VouchersService = void 0;
var common_1 = require("@nestjs/common");
var QRCode = require("qrcode");
var html_pdf_node_1 = require("html-pdf-node");
var voucher_pdf_template_1 = require("./voucher-pdf.template");
var VouchersService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var VouchersService = _classThis = /** @class */ (function () {
        function VouchersService_1(prisma) {
            this.prisma = prisma;
        }
        VouchersService_1.prototype.generateVoucherNumber = function (issueDate) {
            return __awaiter(this, void 0, void 0, function () {
                var year, month, prefix, lastVoucher, nextNumber, lastNumberStr, paddedNumber;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            year = issueDate.substring(2, 4);
                            month = issueDate.substring(5, 7);
                            prefix = "MM".concat(year).concat(month);
                            return [4 /*yield*/, this.prisma.tb_voucher.findFirst({
                                    where: { voucher_no: { startsWith: prefix } },
                                    orderBy: { voucher_no: 'desc' },
                                })];
                        case 1:
                            lastVoucher = _a.sent();
                            nextNumber = 1;
                            if (lastVoucher && lastVoucher.voucher_no) {
                                lastNumberStr = lastVoucher.voucher_no.substring(prefix.length);
                                nextNumber = parseInt(lastNumberStr, 10) + 1;
                            }
                            paddedNumber = String(nextNumber).padStart(4, '0');
                            return [2 /*return*/, "".concat(prefix).concat(paddedNumber)];
                    }
                });
            });
        };
        VouchersService_1.prototype.create = function (createDto, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var hotel, tour, voucherData, companyInfo, voucher_no, error_1;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            hotel = createDto.hotel, tour = createDto.tour, voucherData = __rest(createDto, ["hotel", "tour"]);
                            return [4 /*yield*/, this.prisma.tb_customer.findFirst({
                                    where: { cus_name: voucherData.voucher_company || '', is_deleted: false }
                                })];
                        case 1:
                            companyInfo = _a.sent();
                            return [4 /*yield*/, this.generateVoucherNumber(voucherData.voucher_issue_date)];
                        case 2:
                            voucher_no = _a.sent();
                            _a.label = 3;
                        case 3:
                            _a.trys.push([3, 5, , 6]);
                            return [4 /*yield*/, this.prisma.$transaction(function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    var voucher;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, tx.tb_voucher.create({
                                                    data: __assign(__assign({}, voucherData), { voucher_no: voucher_no, voucher_status: 'Waiting', created_by: userId })
                                                })];
                                            case 1:
                                                voucher = _a.sent();
                                                return [2 /*return*/, voucher];
                                        }
                                    });
                                }); })];
                        case 4: return [2 /*return*/, _a.sent()];
                        case 5:
                            error_1 = _a.sent();
                            console.error('Prisma Transaction Error:', error_1);
                            throw new common_1.InternalServerErrorException('Failed to create composite voucher transaction');
                        case 6: return [2 /*return*/];
                    }
                });
            });
        };
        VouchersService_1.prototype.findAll = function () {
            return __awaiter(this, arguments, void 0, function (page, limit, search, advanced) {
                var skip, take, where, filters, advancedWhere_1, _a, data, total;
                if (page === void 0) { page = 1; }
                if (limit === void 0) { limit = 10; }
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            skip = (page - 1) * limit;
                            take = limit;
                            where = { is_deleted: false };
                            // 1. Global Search
                            if (search) {
                                where.OR = [
                                    { voucher_no: { contains: search } },
                                    { voucher_guest_name: { contains: search } },
                                    { voucher_company: { contains: search } },
                                    { voucher_status: { contains: search } },
                                ];
                            }
                            // 2. Advanced Filters
                            if (advanced) {
                                try {
                                    filters = JSON.parse(advanced);
                                    advancedWhere_1 = [];
                                    filters.forEach(function (f) {
                                        if (!f.field || !f.operator || !f.value)
                                            return;
                                        var condition = {};
                                        if (f.operator === 'contains')
                                            condition[f.field] = { contains: f.value };
                                        else if (f.operator === 'startsWith')
                                            condition[f.field] = { startsWith: f.value };
                                        else if (f.operator === 'endsWith')
                                            condition[f.field] = { endsWith: f.value };
                                        else if (f.operator === 'equals')
                                            condition[f.field] = { equals: f.value };
                                        else if (f.operator === 'gt')
                                            condition[f.field] = { gt: f.value };
                                        else if (f.operator === 'lt')
                                            condition[f.field] = { lt: f.value };
                                        else if (f.operator === 'between' && f.valueTo) {
                                            var isDate = f.field === 'voucher_issue_date' || f.field.includes('date');
                                            if (isDate) {
                                                var toDate = new Date(f.valueTo);
                                                toDate.setHours(23, 59, 59, 999);
                                                condition[f.field] = {
                                                    gte: new Date(f.value),
                                                    lte: toDate
                                                };
                                            }
                                            else {
                                                condition[f.field] = {
                                                    gte: f.value,
                                                    lte: f.valueTo
                                                };
                                            }
                                        }
                                        if (Object.keys(condition).length > 0) {
                                            advancedWhere_1.push(condition);
                                        }
                                    });
                                    if (advancedWhere_1.length > 0) {
                                        where.AND = advancedWhere_1;
                                    }
                                }
                                catch (e) {
                                    console.error('Failed to parse advanced filters', e);
                                }
                            }
                            return [4 /*yield*/, this.prisma.$transaction([
                                    this.prisma.tb_voucher.findMany({
                                        where: where,
                                        skip: skip,
                                        take: take,
                                        orderBy: { voucher_no: 'desc' },
                                        include: {
                                            hotel: true,
                                            attraction: true,
                                            tour: true
                                        }
                                    }),
                                    this.prisma.tb_voucher.count({ where: where })
                                ])];
                        case 1:
                            _a = _b.sent(), data = _a[0], total = _a[1];
                            return [2 /*return*/, {
                                    data: data,
                                    total: total,
                                    page: page,
                                    totalPages: Math.ceil(total / limit)
                                }];
                    }
                });
            });
        };
        VouchersService_1.prototype.findOne = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var voucher;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.tb_voucher.findFirst({
                                where: { id: id, is_deleted: false },
                                include: {
                                    hotel: true,
                                    attraction: true,
                                    tour: true,
                                    pickup_hotel: true
                                }
                            })];
                        case 1:
                            voucher = _a.sent();
                            if (!voucher)
                                throw new common_1.NotFoundException('Voucher not found');
                            return [2 /*return*/, voucher];
                    }
                });
            });
        };
        VouchersService_1.prototype.update = function (id, updateDto, userId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, { status: 'mock-updated', id: id }];
                });
            });
        };
        VouchersService_1.prototype.remove = function (id, userId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.tb_voucher.update({
                            where: { id: id },
                            data: { is_deleted: true, deleted_by: userId, deleted_at: new Date() }
                        })];
                });
            });
        };
        VouchersService_1.prototype.generatePdf = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var voucher, settings, publicUrl, qrCodeBase64, htmlContent, options, file;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.findOne(id)];
                        case 1:
                            voucher = _a.sent();
                            return [4 /*yield*/, this.prisma.tb_system_settings.findFirst()];
                        case 2:
                            settings = (_a.sent()) || {};
                            publicUrl = "http://localhost:5173/api/vouchers/".concat(id, "/pdf");
                            return [4 /*yield*/, QRCode.toDataURL(publicUrl, { margin: 1 })];
                        case 3:
                            qrCodeBase64 = _a.sent();
                            htmlContent = (0, voucher_pdf_template_1.generateVoucherHtml)(voucher, settings, qrCodeBase64);
                            options = { format: 'A4', printBackground: true };
                            file = { content: htmlContent };
                            return [4 /*yield*/, html_pdf_node_1.default.generatePdf(file, options)];
                        case 4: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        return VouchersService_1;
    }());
    __setFunctionName(_classThis, "VouchersService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        VouchersService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return VouchersService = _classThis;
}();
exports.VouchersService = VouchersService;
