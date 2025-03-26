import {API} from "../configurations/configuration";
import httpClient from "../configurations/httpClient";
import {validateInput} from "../utils/ValidateInputUtil";

export const register = async (body) => {
    return await httpClient.post(API.REGISTER, validateInput(body));
};
