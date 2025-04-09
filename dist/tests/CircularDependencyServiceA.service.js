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
exports.CircularDependencyServiceA = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const CircularDependencyServiceB_service_1 = require("./CircularDependencyServiceB.service");
const nest_simple_transactional_1 = require("nest-simple-transactional");
let CircularDependencyServiceA = class CircularDependencyServiceA extends nest_simple_transactional_1.Transactional {
    constructor(serviceB, moduleRef) {
        super(moduleRef);
        this.serviceB = serviceB;
    }
    call() {
        return this.constructor.name;
    }
    getServiceBName() {
        return this.serviceB.call();
    }
};
exports.CircularDependencyServiceA = CircularDependencyServiceA;
exports.CircularDependencyServiceA = CircularDependencyServiceA = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => CircularDependencyServiceB_service_1.CircularDependencyServiceB))),
    __metadata("design:paramtypes", [CircularDependencyServiceB_service_1.CircularDependencyServiceB,
        core_1.ModuleRef])
], CircularDependencyServiceA);
//# sourceMappingURL=CircularDependencyServiceA.service.js.map