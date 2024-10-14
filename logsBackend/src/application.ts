import "reflect-metadata";
import { promises as fsPromises } from 'fs';
import path from 'path';
import { InversifyExpressServer } from "inversify-express-utils";
import express, { NextFunction, Request, Response, Router } from "express";
import cors from 'cors';
import * as bodyParser from 'body-parser';
import helmet from 'helmet';
import hpp from 'hpp';
import * as http from "http";
import * as https from 'https';
import * as mongoose from "mongoose";

import { IocKernel } from "./services/IOCKernel";
import "./controllers/healthController";
import "./controllers/logsController";



const contentLength = require('express-content-length-validator')
const MAX_CONTENT_LENGTH_ACCEPTED = 900000;


//inversy configuration -> container
export interface IApplication {
	run(): Promise<void>;
	stop(): Promise<void>;
}

export class Application implements IApplication {
	private dbConnection: mongoose.Connection;
	private inversifyServer: InversifyExpressServer;
	private iocKernel: IocKernel;
	private webApp: express.Application;
	private httpDaemon: http.Server;
	
	constructor() {
	}
	async attachDB(): Promise<void> {
		mongoose.set('strictQuery', true);
		try {
			console.log(`nodeEnv: ${process.env.NODE_ENV}`);
			console.log( ` env path: ${process.env.DOTENV_CONFIG_PATH}`); 
			const dbURI = `mongodb+srv://${process.env.RECOURSE_USER}:${process.env.RECOURSE_PASS}@cluster0.jpq1wbq.mongodb.net/${process.env.DATABASE}`;

			const length = dbURI?.length ?? 0;
			const lowIdx = length - 30;
			
			console.log(`ending part of DB_URI...  ${dbURI}`);
			await mongoose.connect(dbURI, {
	// 			useNewUrlParser: true,
	// 			useUnifiedTopology: true,
	// 			useCreateIndex: true
			});
			this.dbConnection = mongoose.connection;
			this.dbConnection
				?.on('open', console.info.bind(console, 'Database connection: open'))
				?.on('close', console.info.bind(console, 'Database connection: close'))
				?.on('disconnected', console.info.bind(console, 'Database connection: disconnecting'))
				?.on('disconnected', console.info.bind(console, 'Database connection: disconnected'))
				?.on('reconnected', console.info.bind(console, 'Database connection: reconnected'))
				?.on('fullsetup', console.info.bind(console, 'Database connection: fullsetup'))
				?.on('all', console.info.bind(console, 'Database connection: all'))
				?.on('error', console.error.bind(console, 'MongoDB connection: error:'));
			
		} catch (error) {
      		console.debug(error);
   		 }
	}

	async detachDB(): Promise<void> {
		await this.dbConnection?.close();
		await mongoose.disconnect();
	}

	async run(): Promise<void> {
		try {
			await this.attachDB();
			this.webApp = express();
			this.iocKernel = new IocKernel();
			this.inversifyServer = new InversifyExpressServer(
				this.iocKernel, 
				null, 
				{ rootPath: "/api-v2" }, 
				this.webApp);

			this.inversifyServer.setConfig((app) => {
				app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
				app.use(helmet.crossOriginOpenerPolicy({ policy: "same-origin-allow-popups" }));

				//app.use(helmet.crossOriginResourcePolicy({ policy: "same-site" }));
				app.use(hpp());

				// add body parser
				app.use(bodyParser.urlencoded({ extended: true }));
				app.use(bodyParser.json());
				app.use(cors());
				app.use(contentLength.validateMax({
					max: MAX_CONTENT_LENGTH_ACCEPTED, 
					status: 500, 
					message: "exceed max length accepted: stop it!"})); // max size accepted for the content-length

			});
			this.inversifyServer.setErrorConfig((app) => {
				app.use((err: Error, req: Request, res: Response, next:NextFunction) =>{
					if (err) {
						return res.json(err.message);
					}
					next();
				});
			})
			const configuredApp = this.inversifyServer.build();
			this.httpDaemon = http.createServer(configuredApp);
			this.httpDaemon.listen(parseInt(process.env.PORT || '3003'));
			console.log("daemons started,\nwaiting for the end...");
		}
		catch (error) {
			console.error("in run app: " + error);
		}
	}


	async stop(): Promise<void> {
		await this.detachDB();
		const closureHttp = new Promise<void>((resolve, reject) =>{
				this.httpDaemon.close((err)=>{
					if(err){return reject(err);}
					resolve();
					this.httpDaemon.unref();
					console.log("http daemon closed");
				});
		});
		await closureHttp;
	}
}
