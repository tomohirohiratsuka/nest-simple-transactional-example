import { ModuleRef } from '@nestjs/core';
import { CircularDependencyServiceB } from './CircularDependencyServiceB.service';
import { Transactional } from "nest-simple-transactional";
export declare class CircularDependencyServiceA extends Transactional<CircularDependencyServiceA> {
    private serviceB;
    constructor(serviceB: CircularDependencyServiceB, moduleRef: ModuleRef);
    call(): string;
    getServiceBName(): string;
}
