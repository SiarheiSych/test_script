import { browserWrapper } from "../element-wrapper";
import { getLogger } from "log4js";
import { userCredantions } from "../../constants/constant";
import { LoginPage } from "../../constants";

const logger = getLogger("[Login helper]");

let rpLoginPage: LoginPage;

export async function loginAsUser() {
  try {
    await browserWrapper.navigate("http://localhost:8080/");
    await rpLoginPage.login(userCredantions);
  } catch (error) {
    logger.info("Page failed to load");
  }
}
