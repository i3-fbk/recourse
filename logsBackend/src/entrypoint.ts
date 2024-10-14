import {Application } from './application';
import { config } from "dotenv";
//config({ path: '.env' });


if (process.env.NODE_ENV !== undefined) {
	config({ path: `.env.${process.env.NODE_ENV}` });
}
else {
	config();
}

const myApp = new Application();
(async () => await myApp.run())()
