import "reflect-metadata";
import {Request, Response} from "express"
import {BaseHttpController, controller, httpGet, httpPost, request, response} from "inversify-express-utils"
import { injectable, inject } from "inversify";


import {TYPES} from "../services/typesDefinition";
import { IRecourseUILog, LogsRepoService} from "../services/LogsRepoService";
import { isApiError } from "./apiError";


// store  ->[POST]  http://localhost:3004/api-v2/uilogger/store
// /all => [GET]  http://localhost:3004/api-v2/uilogger/all


@controller('/uilogger')
export class UILogsController extends BaseHttpController {
	service: LogsRepoService;
	constructor(
		@inject(TYPES.LogsRepoService) service: LogsRepoService) {
		super();
		this.service = service;
	}

   
	@httpPost('/store')
	async storeLog(
		@request() req: Request,
		@response() res: Response): Promise<void>{
		try {
			console.log(`requesting add log`);
			const candidateLog = req.body as  IRecourseUILog;
      		const data = await this.service.addNewLog(candidateLog);
			if (data !== undefined) {
				res.status(200)
					.json(JSON.stringify(data));
				} 
			else {res.status(502).end();}
		} catch (error: unknown) {
			const content = isApiError(error)? error.message:  JSON.stringify(error);
			res.status(502).json({what: content});
		}
	}
	@httpGet('/all')
	async logs(@request() req: Request,
		@response() res: Response): Promise<void>{
		try {
			console.log(`requesting all logs`);
			const data = await this.service.allLogs();
			if (data !== undefined) {
				res.status(200)
					.json(JSON.stringify(data));
				} 
			else {res.status(502).end();}
		} catch (error: unknown) {
			const content = isApiError(error)? error.message:  JSON.stringify(error);
			res.status(502).json({what: content});
		}
	}
}