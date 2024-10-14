
import { interfaces } from "inversify";
import "reflect-metadata";
import { Container } from "inversify";
import { TYPES } from "./typesDefinition";
import mongoose, { Connection } from "mongoose";


import { HealthCheckService } from "./healthCheckService";
import { LogsRepoService} from "./LogsRepoService";


//
export interface IRepoProvider {
	getHealthCheckService(): HealthCheckService;
	getLogsRepoService(): LogsRepoService 
}

export class IocKernel extends Container implements IRepoProvider {
	connection: Connection;
	constructor() {
		super();
		mongoose.set('strictQuery', true);
		super.bind<HealthCheckService>(TYPES.HealthCheckService).to(HealthCheckService);
		super.bind<LogsRepoService>(TYPES.LogsRepoService).to(LogsRepoService);

	}

	
	public getHealthCheckService(): HealthCheckService{
		return super.get<HealthCheckService>(TYPES.HealthCheckService);
	}
	public getLogsRepoService(): LogsRepoService {
		return super.get<LogsRepoService>(TYPES.LogsRepoService);

	}

}