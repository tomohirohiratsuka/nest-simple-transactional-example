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
const common_1 = require("@nestjs/common");
const nest_simple_transactional_1 = require("nest-simple-transactional");
const core_1 = require("@nestjs/core");
const testing_1 = require("@nestjs/testing");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const CircularDependencyServiceA_service_1 = require("./CircularDependencyServiceA.service");
const CircularDependencyServiceB_service_1 = require("./CircularDependencyServiceB.service");
const user_entity_1 = require("../entities/user.entity");
const company_entity_1 = require("../entities/company.entity");
const defaultDatabaseConfig = {
    database: `testdb`,
    entities: (0, typeorm_2.getMetadataArgsStorage)().tables.map((tbl) => tbl.target),
    host: 'db',
    password: 'admin',
    port: 5432,
    synchronize: true,
    type: 'postgres',
    username: 'admin',
};
const getTestingModule = (providers = [], entities = []) => {
    return testing_1.Test.createTestingModule({
        imports: [
            typeorm_1.TypeOrmModule.forRoot(defaultDatabaseConfig),
            typeorm_1.TypeOrmModule.forFeature(entities)
        ],
        providers
    }).compile();
};
describe('Transactional, check constructor rebuilds', () => {
    let Hoge = class Hoge {
        call() {
            return this.constructor.name;
        }
    };
    Hoge = __decorate([
        (0, common_1.Injectable)()
    ], Hoge);
    let module;
    afterEach(async () => {
        await module.close();
    });
    it('Should be able to call methods of property injectioned service through withTransaction', async () => {
        let Sample = class Sample extends nest_simple_transactional_1.Transactional {
            constructor(moduleRef, hoge) {
                super(moduleRef);
                this.hoge = hoge;
            }
            getHogeName() {
                return this.hoge.call();
            }
        };
        Sample = __decorate([
            (0, common_1.Injectable)(),
            __metadata("design:paramtypes", [core_1.ModuleRef, Hoge])
        ], Sample);
        module = await getTestingModule([Sample, Hoge]);
        const sampleService = module.get(Sample);
        const testDatasource = module.get(typeorm_2.DataSource);
        await testDatasource.transaction(async (manager) => {
            expect(sampleService.withTransaction(manager).getHogeName()).toBe(Hoge.name);
        });
    });
    it('should be able to call methods of cutom token injectioned service through withTransaction', async () => {
        let Sample = class Sample extends nest_simple_transactional_1.Transactional {
            constructor(moduleRef, hoge) {
                super(moduleRef);
                this.hoge = hoge;
            }
            getHogeName() {
                return this.hoge.call();
            }
        };
        Sample = __decorate([
            (0, common_1.Injectable)(),
            __param(1, (0, common_1.Inject)('Hoge')),
            __metadata("design:paramtypes", [core_1.ModuleRef,
                Hoge])
        ], Sample);
        module = await getTestingModule([
            Sample,
            {
                provide: 'Hoge',
                useClass: Hoge,
            },
        ]);
        const dataSource = module.get(typeorm_2.DataSource);
        const sample = module.get(Sample);
        await dataSource.transaction(async (manager) => {
            const name = sample.withTransaction(manager).getHogeName();
            expect(name).toBe(Hoge.name);
        });
    });
    it('should be able to call methods of service which is injected by forwardRef through withTransaction', async () => {
        module = await getTestingModule([CircularDependencyServiceA_service_1.CircularDependencyServiceA, CircularDependencyServiceB_service_1.CircularDependencyServiceB]);
        const dataSource = module.get(typeorm_2.DataSource);
        const serviceA = module.get(CircularDependencyServiceA_service_1.CircularDependencyServiceA);
        await dataSource.transaction(async (manager) => {
            const serviceBName = serviceA.withTransaction(manager).getServiceBName();
            expect(serviceBName).toBe(CircularDependencyServiceB_service_1.CircularDependencyServiceB.name);
        });
    });
    describe('Optional injection', () => {
        it('Should instantiate service when it is provided', async () => {
            let Sample = class Sample extends nest_simple_transactional_1.Transactional {
                constructor(moduleRef, hoge) {
                    super(moduleRef);
                    this.hoge = hoge;
                }
                getHogeName() {
                    return this.hoge?.call();
                }
            };
            Sample = __decorate([
                (0, common_1.Injectable)(),
                __param(1, (0, common_1.Optional)()),
                __metadata("design:paramtypes", [core_1.ModuleRef,
                    Hoge])
            ], Sample);
            module = await getTestingModule([Sample, Hoge]);
            const dataSource = module.get(typeorm_2.DataSource);
            const sample = module.get(Sample);
            await dataSource.transaction(async (manager) => {
                const name = sample.withTransaction(manager).getHogeName();
                expect(name).toBe(Hoge.name);
            });
        });
        it('Should return undefined when it is not provided', async () => {
            let Sample = class Sample extends nest_simple_transactional_1.Transactional {
                constructor(moduleRef, hoge) {
                    super(moduleRef);
                    this.hoge = hoge;
                }
                getHogeName() {
                    return this.hoge?.call();
                }
            };
            Sample = __decorate([
                (0, common_1.Injectable)(),
                __param(1, (0, common_1.Optional)()),
                __metadata("design:paramtypes", [core_1.ModuleRef,
                    Hoge])
            ], Sample);
            module = await getTestingModule([Sample]);
            const dataSource = module.get(typeorm_2.DataSource);
            const sample = module.get(Sample);
            await dataSource.transaction(async (manager) => {
                const name = sample.withTransaction(manager).getHogeName();
                expect(name).toBeUndefined();
            });
        });
    });
    it('Should be able to call methods of object injectioned through withTransaction', async () => {
        const myObject = {
            getName() {
                return 'myObject';
            }
        };
        let Sample = class Sample extends nest_simple_transactional_1.Transactional {
            constructor(moduleRef, myObject) {
                super(moduleRef);
                this.myObject = myObject;
            }
            getMyObjectName() {
                return this.myObject.getName();
            }
        };
        Sample = __decorate([
            (0, common_1.Injectable)(),
            __param(1, (0, common_1.Inject)('MyObject')),
            __metadata("design:paramtypes", [core_1.ModuleRef, Object])
        ], Sample);
        module = await getTestingModule([
            Sample,
            {
                provide: 'MyObject',
                useValue: myObject,
            }
        ]);
        const dataSource = module.get(typeorm_2.DataSource);
        const sample = module.get(Sample);
        await dataSource.transaction(async (manager) => {
            const name = sample.withTransaction(manager).getMyObjectName();
            expect(name).toBe(myObject.getName());
        });
    });
    it('should be able to call methods of factory(non class) injectioned through withTransaction', async () => {
        let Sample = class Sample extends nest_simple_transactional_1.Transactional {
            constructor(moduleRef, myString) {
                super(moduleRef);
                this.myString = myString;
            }
            getMyString() {
                return this.myString;
            }
        };
        Sample = __decorate([
            (0, common_1.Injectable)(),
            __param(1, (0, common_1.Inject)('MyString')),
            __metadata("design:paramtypes", [core_1.ModuleRef, String])
        ], Sample);
        module = await getTestingModule([
            Sample,
            {
                provide: 'MyString',
                useFactory: () => 'myString',
            }
        ]);
        const dataSource = module.get(typeorm_2.DataSource);
        const sample = module.get(Sample);
        await dataSource.transaction(async (manager) => {
            const name = sample.withTransaction(manager).getMyString();
            expect(name).toBe('myString');
        });
    });
});
const clearDB = async (module) => {
    const dataSource = module.get(typeorm_2.DataSource);
    const entities = dataSource.entityMetadatas;
    for (const entity of entities) {
        const repository = dataSource.getRepository(entity.name);
        await repository.clear();
    }
};
describe('Transactional, check rollbacks', () => {
    let Sample = class Sample extends nest_simple_transactional_1.Transactional {
        constructor(moduleRef, userRepository, companyRepository) {
            super(moduleRef);
            this.userRepository = userRepository;
            this.companyRepository = companyRepository;
        }
        createUser(name) {
            return this.userRepository.save({ name });
        }
        createCompany(name) {
            return this.companyRepository.save({ name });
        }
    };
    Sample = __decorate([
        (0, common_1.Injectable)(),
        __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
        __param(2, (0, typeorm_1.InjectRepository)(company_entity_1.Company)),
        __metadata("design:paramtypes", [core_1.ModuleRef,
            typeorm_2.Repository,
            typeorm_2.Repository])
    ], Sample);
    let module;
    let dataSource;
    let sampleService;
    beforeAll(async () => {
        module = await getTestingModule([Sample], [user_entity_1.User, company_entity_1.Company]);
        dataSource = module.get(typeorm_2.DataSource);
        sampleService = module.get(Sample);
    });
    beforeEach(async () => {
        await clearDB(module);
    });
    afterAll(async () => {
        await module.close();
    });
    it('should commit when no error is thrown', async () => {
        const userName = 'René Lalique';
        const companyName = 'Dragonfly lady';
        await dataSource.transaction(async (manager) => {
            await sampleService.withTransaction(manager).createUser(userName);
            await sampleService.withTransaction(manager).createCompany(companyName);
        });
        const userRepo = dataSource.getRepository(user_entity_1.User);
        const userExists = await userRepo.exist({ where: { name: userName } });
        expect(userExists).toBeTruthy();
        const companyRepo = dataSource.getRepository(company_entity_1.Company);
        const companyExists = await companyRepo.exist({ where: { name: companyName } });
        expect(companyExists).toBeTruthy();
    });
    it('Should rollback when error is thrown', async () => {
        const userName = 'René François Ghislain Magritte';
        const companyName = 'The empire of light';
        try {
            await dataSource.transaction(async (manager) => {
                await sampleService.withTransaction(manager).createUser(userName);
                await sampleService.withTransaction(manager).createCompany(companyName);
                throw new Error('rollback');
            });
        }
        catch (e) {
            if (e.message !== 'rollback')
                throw e;
        }
        const userRepo = dataSource.getRepository(user_entity_1.User);
        const userExists = await userRepo.exist({ where: { name: userName } });
        expect(userExists).toBeFalsy();
        const companyRepo = dataSource.getRepository(company_entity_1.Company);
        const companyExists = await companyRepo.exist({ where: { name: companyName } });
        expect(companyExists).toBeFalsy();
    });
});
//# sourceMappingURL=transactional.spec.js.map