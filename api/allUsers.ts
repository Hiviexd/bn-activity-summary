import axios from "axios";
import { QatAllUsersResponse } from "../types/qat";
import { consoleCheck, consoleError, consoleLog } from "../helpers/core/logger";

export default async function (): Promise<QatAllUsersResponse> {
    try {
		consoleLog("allUsers fetcher", `Fetching all BNs/NATs`);

		const req = await axios(`https://bn.mappersguild.com/interOp/users`, {
			headers: {
				username: `${process.env.QAT_USER}`,
				secret: `${process.env.QAT_SECRET}`,
			},
		});

		const res = req.data;

		consoleCheck("allUsers fetcher", `Fetched all users!`);

		return {
			status: res ? 200 : 404,
			data: res,
		};
	} catch (e: any) {
		consoleError("allUsers fetcher", "Encountered an error:");
		console.error(e);

		return {
			status: 500,
			data: e,
		};
	}
}
