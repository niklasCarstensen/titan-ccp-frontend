import { DateTime } from "luxon";

export default interface TimeMode {
    autoLoading: boolean;
    getTime: () => DateTime;
}