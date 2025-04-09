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
exports.CircularDependencyServiceB = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const nest_simple_transactional_1 = require("nest-simple-transactional");
const CircularDependencyServiceA_service_1 = require("./CircularDependencyServiceA.service");
let CircularDependencyServiceB = class CircularDependencyServiceB extends nest_simple_transactional_1.Transactional {
    constructor(moduleRef, serviceA) {
        super(moduleRef);
        this.serviceA = serviceA;
    }
    call() {
        return this.constructor.name;
    }
    getServiceAName() {
        return this.serviceA.call();
    }
};
exports.CircularDependencyServiceB = CircularDependencyServiceB;
exports.CircularDependencyServiceB = CircularDependencyServiceB = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => CircularDependencyServiceA_service_1.CircularDependencyServiceA))),
    __metadata("design:paramtypes", [core_1.ModuleRef,
        CircularDependencyServiceA_service_1.CircularDependencyServiceA])
], CircularDependencyServiceB);
//# sourceMappingURL=CircularDependencyServiceB.service.js.map