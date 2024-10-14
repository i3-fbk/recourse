import "reflect-metadata";
import {Request, Response} from "express"
import {BaseHttpController, controller, httpGet, httpHead} from "inversify-express-utils"
import { injectable, inject } from "inversify";


import {TYPES} from "../services/typesDefinition";
import { HealthCheckService } from "../services/healthCheckService";
import { isApiError } from "./apiError";


@controller('')
export class HealthController extends BaseHttpController {
	healthCheckService: HealthCheckService;
	constructor(
		@inject(TYPES.HealthCheckService) healthService: HealthCheckService) {
		super();
		this.healthCheckService = healthService;
	}

    @httpHead('/health')
    private health(req: Request, resp: Response) {
        //head should not return body but this is to avoid 204  no content
		 resp.json({uptime: process.uptime()})
    }

	@httpHead('/dbHealth')
	async dbHealth(req: Request, resp: Response) {
		try {
			console.log(`requesting db health check`);
      		const data = await this.healthCheckService.getOrCreate();
			const isUp = data !== undefined;
			if (isUp) {resp.status(200).end();} 
			else {resp.status(502).end();}
		} catch (error: unknown) {
			const content = isApiError(error)? error.message:  JSON.stringify(error);
			resp.status(502).end();
		}
	}
}