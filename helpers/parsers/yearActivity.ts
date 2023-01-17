import { UserActivityResponse } from "../../types/qat";
import moment from "moment";
import { consoleError } from "../core/logger";
import config from "../../config.json";

export default function (activity: UserActivityResponse): UserActivityResponse {
    if (activity.status !== 200) {
        consoleError("yearActivity" ,`Activity fetch failed with code ${activity.status}, check previous step`);
        return activity;
    }

    const uniqueNominations = activity.data.uniqueNominations.filter(
        (event) => {
            return moment(event.timestamp).year() === config.year;
        }
    );
    const nominationsDisqualified =
        activity.data.nominationsDisqualified.filter((event) => {
            return moment(event.timestamp).year() === config.year;
        });
    const nominationsPopped = activity.data.nominationsPopped.filter(
        (event) => {
            return moment(event.timestamp).year() === config.year;
        }
    );
    const disqualifications = activity.data.disqualifications.filter(
        (event) => {
            return moment(event.timestamp).year() === config.year;
        }
    );
    const pops = activity.data.pops.filter((event) => {
        return moment(event.timestamp).year() === config.year;
    });
    const qualityAssuranceChecks = activity.data.qualityAssuranceChecks.filter(
        (event) => {
            return moment(event.timestamp).year() === config.year;
        }
    );
    const disqualifiedQualityAssuranceChecks =
        activity.data.disqualifiedQualityAssuranceChecks.filter((event) => {
            return moment(event.timestamp).year() === config.year;
        });

    return {
        status: activity.status,
        data: {
            uniqueNominations: uniqueNominations,
            nominationsDisqualified: nominationsDisqualified,
            nominationsPopped: nominationsPopped,
            disqualifications: disqualifications,
            pops: pops,
            qualityAssuranceChecks: qualityAssuranceChecks,
            disqualifiedQualityAssuranceChecks:
                disqualifiedQualityAssuranceChecks,
        },
    };
}
