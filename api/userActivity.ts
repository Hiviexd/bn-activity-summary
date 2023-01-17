import axios from "axios";
import { UserActivityResponse } from "../types/qat";
import { consoleCheck, consoleError, consoleLog } from "../helpers/core/logger";

export default async function (
    userId: number,
    username: string,
    timeframe: number
): Promise<UserActivityResponse> {
    try {
        consoleLog(
            "userActivity fetcher",
            `Fetching user activity for user ${username} (${userId}) in the past ${timeframe} days...`
        );

        const req = await axios(
            `https://bn.mappersguild.com/interOp/nominationResets/${userId}/${timeframe}`,
            {
                headers: {
                    username: `${process.env.QAT_USER}`,
                    secret: `${process.env.QAT_SECRET}`,
                },
            }
        );

        const res = req.data;

        consoleCheck(
            "userActivity fetcher",
            `user activity for user ${username} (${userId}) found!`
        );

        return {
            status: res ? 200 : 404,
            data: res,
        };
    } catch (e: any) {
        consoleError("userActivity fetcher", "Encountered an error:");
        console.error(e);

        return {
            status: 500,
            data: e,
        };
    }
}
