import { IUserProfile } from "../../types/user";

export default function (mode: string, user: IUserProfile): number {
    switch (mode) {
        case 'osu':
            return user.osuNominationCount;
        case 'taiko':
            return user.taikoNominationCount;
        case 'catch':
            return user.catchNominationCount;
        case 'mania':
            return user.maniaNominationCount;
        default:
            return 0;
    }
}
