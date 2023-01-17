import dotenv from "dotenv";
dotenv.config();
import moment from "moment";
import fs from "fs";
import qatApi from "./api/qatApi";
import { IUserProfile } from "./types/user";
import yearActivity from "./helpers/parsers/yearActivity";
import parseActivity from "./helpers/parsers/parseActivity";
import getNomCountPerMode from "./helpers/parsers/getNomCountPerMode";
import { consoleCheck, consoleLog } from "./helpers/core/logger";
import config from "./config.json"

let output: IUserProfile[] = [];
const timeframe = moment().diff(moment(`${config.year}-01-01`), "days");
const csvHeader = "name,Nomination count,Reset count,Resets done by user count,QA count, Mapper count,Unique mappers percentage,Green sev count,Grey sev count,Red sev count\n";

const main = async () => {
    // ? create output folder if it doesn't exist
    if (!fs.existsSync("./output")) fs.mkdirSync("./output");
    if (!fs.existsSync("./output/json")) fs.mkdirSync("./output/json");
    if (!fs.existsSync("./output/csv")) fs.mkdirSync("./output/csv");

    consoleLog("main", `Parsing activity of all BNs in ${config.year}...`);

    // ? fetch all users
    const allUsers = await qatApi.fetch.allUsers();

    // ? fetch and parse activity of all users
    for (const user of allUsers.data) {
        const activity = await qatApi.fetch.userActivity(user.osuId, user.username, timeframe);
        const parsedActivity = parseActivity(user, yearActivity(activity));
        output.push(parsedActivity);

        consoleCheck("main", `Successfully parsed ${user.username}`);
    }

    // ? sort by nominationCount
    const sorted = output.sort((a, b) => b.nominationCount - a.nominationCount);

    // ? write to json files
    consoleLog("main", "writing to all.json");
    fs.writeFileSync("./output/json/all.json", JSON.stringify(sorted, null, 4));

    const modes = ["osu", "taiko", "catch", "mania"];

    modes.forEach((mode) => {
        consoleLog("main", `writing to ${mode}.json`);
        const sorted = output.sort((a, b) => getNomCountPerMode(mode, b) - getNomCountPerMode(mode, a));
        const filtered = sorted.filter((user) => user.modes.includes(mode));
        fs.writeFileSync(`./output/json/${mode}.json`, JSON.stringify(filtered, null, 4));
    });
    consoleCheck("main", "Wrote to json files");

    // ? write to csv files
    consoleLog("main", "Writing to all.csv");
    const all = JSON.parse(fs.readFileSync("./output/json/all.json", "utf-8"));
    let csv = csvHeader;
    for (const user of all) {
        csv += `${user.name},${user.nominationCount},${user.resetCount},${user.resetsDoneByUserCount},${user.qaCount},${user.mapperCount},${user.mapperPercentage},${user.greenSevCount},${user.greySevCount},${user.redSevCount}\n`;
    }
    fs.writeFileSync("./output/csv/all.csv", csv);
    

    modes.forEach((mode) => {
        consoleLog("main", `writing to ${mode}.csv`);
        const modeLeaderboard = JSON.parse(fs.readFileSync(`./output/json/${mode}.json`, "utf-8"));
        let csv = csvHeader;
        for (const user of modeLeaderboard) {
            csv += `${user.name},${getNomCountPerMode(mode, user)},${user.resetCount},${user.resetsDoneByUserCount},${user.qaCount},${user.mapperCount},${user.mapperPercentage},${user.greenSevCount},${user.greySevCount},${user.redSevCount}\n`;
        }
        fs.writeFileSync(`./output/csv/${mode}.csv`, csv);
    });
    consoleCheck("main", "Wrote to csv files");

    // ? end
    consoleCheck("main", "Done!");
    return;
}

main();
