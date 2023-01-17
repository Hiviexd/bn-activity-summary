import { IUserProfile } from "../../types/user";
import { UserActivityResponse, QatUser } from "../../types/qat";
import getUniqueMappersNumber from "./getUniqueMappers";
import parseSevs from "./parseSevs";
import { consoleError } from "../core/logger";

export default function (user: QatUser, activity: UserActivityResponse): IUserProfile {
    if (activity.status !== 200) {
        consoleError("parseActivity" ,`Activity fetch failed on ${user.username} with code ${activity.status}, check previous step`);
        return {
            name: `Error - ${user.username}}`,
            modes: [],
            nominationCount: 0,
            osuNominationCount: 0,
            taikoNominationCount: 0,
            catchNominationCount: 0,
            maniaNominationCount: 0,
            resetCount: 0,
            resetsDoneByUserCount: 0,
            qaCount: 0,
            mapperCount: 0,
            mapperPercentage: 0,
            greenSevCount: 0,
            greySevCount: 0,
            redSevCount: 0,
        };
    }

    const { green, grey, red } = parseSevs(activity);

    const nominationCount = activity.data.uniqueNominations.length;
    const osuNominationCount = activity.data.uniqueNominations.filter((n) => n.modes.includes("osu")).length;
    const taikoNominationCount = activity.data.uniqueNominations.filter((n) => n.modes.includes("taiko")).length;
    const catchNominationCount = activity.data.uniqueNominations.filter((n) => n.modes.includes("catch")).length;
    const maniaNominationCount = activity.data.uniqueNominations.filter((n) => n.modes.includes("mania")).length;
    const nominationsDisqualified = activity.data.nominationsDisqualified.length;
    const nominationsPopped = activity.data.nominationsPopped.length;
    const disqualifications = activity.data.disqualifications.length;
    const pops = activity.data.pops.length;
    const qualityAssuranceChecks = activity.data.qualityAssuranceChecks.length;

    const resetCount = nominationsDisqualified + nominationsPopped;
    const resetsDoneByUserCount = disqualifications + pops;
    const mapperCount = getUniqueMappersNumber(activity);
    const mapperPercentage = Math.round(mapperCount / nominationCount * 100);
    const greenSevCount = green;
    const greySevCount = grey;
    const redSevCount = red;

    return {
        name: user.username,
        modes: user.modes,
        nominationCount: nominationCount,
        osuNominationCount: osuNominationCount,
        taikoNominationCount: taikoNominationCount,
        catchNominationCount: catchNominationCount,
        maniaNominationCount: maniaNominationCount,
        resetCount: resetCount,
        resetsDoneByUserCount: resetsDoneByUserCount,
        qaCount: qualityAssuranceChecks,
        mapperCount: mapperCount,
        mapperPercentage: mapperPercentage,
        greenSevCount: greenSevCount,
        greySevCount: greySevCount,
        redSevCount: redSevCount,
    };
}
