import Enum from "enum-next";

const FORM_INPUT_STATE = new Enum(
  ["DEFAULT", "LOADING", "SUCCESS", "ERROR"],
  true
);

export { FORM_INPUT_STATE };
