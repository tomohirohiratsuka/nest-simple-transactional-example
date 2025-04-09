import { ModuleRef } from '@nestjs/core';
import { Transactional } from "nest-simple-transactional";
import { CircularDependencyServiceA } from './CircularDependencyServiceA.service';
export declare class CircularDependencyServiceB extends Transactional<CircularDependencyServiceB> {
    private serviceA;
    constructor(moduleRef: ModuleRef, serviceA: CircularDependencyServiceA);
    call(): string;
    getServiceAName(): string;
}
