import { UserActivityResponse } from "../../types/qat";

export default function parseSevs(activity: UserActivityResponse) {
    let greenCount = 0;
    let greyCount = 0;
    let redCount = 0;

    activity.data.nominationsDisqualified
        .concat(activity.data.nominationsPopped)
        .forEach((nomination) => {
            if (
                (nomination.obviousness === 0) ||
                (nomination.obviousness === 1 && nomination.severity === 0)
            ) {
                greenCount++;
            } else if (
                (nomination.obviousness === 1 && nomination.severity === 1) ||
                (nomination.obviousness === 1 && nomination.severity === 2)
            ) {
                greyCount++;
            } else if (
                (nomination.obviousness === 2)
            ) {
                redCount++;
            }
        });

    return {
        green: greenCount,
        grey: greyCount,
        red: redCount,
    };
}
