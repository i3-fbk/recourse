import "reflect-metadata";
import mongoose, {Types, Schema, Document} from "mongoose";
import { injectable } from "inversify";


class HealthCheck {
    constructor(event: string, date: Date) {}
}
// HealthCheckMongo.ts
const healthCheckSchema = new mongoose.Schema(
    {
        event: String,
		when: {type: Date}
    },
    {
        collection: 'healthCheck',
        minimize: false,
    },
);

const docFactory = mongoose.model('health', healthCheckSchema);

@injectable()
export class HealthCheckService {

	async getOrCreate(): Promise<HealthCheck> {
		console.log(`requesting heallth`);
		const data = await docFactory.findOneAndUpdate({"event" : "check"}, 
			{"event" : "check",
			  "when": Date.now()
			}, {
				new: true,
				upsert: true,
			});
		return data as HealthCheck;
	}

}