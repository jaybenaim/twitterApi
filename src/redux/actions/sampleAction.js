import { SAMPLE_TYPE } from "./types";

export const setSampleAction = (decoded) => {
  return {
    type: SAMPLE_TYPE,
    payload: decoded,
  };
};
