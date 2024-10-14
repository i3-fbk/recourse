import "reflect-metadata";
import mongoose, {Types, Schema, Document, Model} from "mongoose";
import { injectable } from "inversify";


//  log form sample 
// {
//     "timestamp": "Tue Jun 05 2018 17:23:42 GMT+0530 (IST)",
//     "userID": "1234",
//     "event": "test",
//     "parameters": ["un", "lonfo", "non", "barrigatta"]
// }




// 1. Create an interface representing a document in MongoDB.
export interface IRecourseUILog {
	timestamp : Date;
	userID: string;
	"user ID": string,
	uiVersion:string,
	event: string;
	parameter: string;
}
// 2. Create a Schema corresponding to the document interface.
const logSchema = new Schema<IRecourseUILog, Model<IRecourseUILog>>({
	timestamp: {type: Date},
	uiVersion: {type: String},
	"user ID": {type: String},
	userID: {type: String},
	event: {type: String},
	parameter: {type: String}
},{
	collection: "ui_logs",
	minimize: false
});

const docFactory = mongoose.model('uiLog', logSchema);

@injectable()
export class LogsRepoService {

	async addNewLog(log: IRecourseUILog): Promise<IRecourseUILog> {
		const data = await docFactory.create(log);
		return data as IRecourseUILog;
	}

	async allLogs(): Promise<Array<IRecourseUILog>>{
		return await docFactory.find({})
		.sort({})
		.exec();
	}
	
}