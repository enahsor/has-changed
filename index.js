const core = require("@actions/core");
const github = require("@actions/github");
const fs = require("fs");

try {
  const services = core.getInput("services");
  console.log(`Services : ${services}`);
  const time = new Date().toTimeString();
  core.setOutput("time", time);
  const payload = JSON.stringify(github.context.payload, undefined, 2);
  console.log(`The event payload: ${payload}`);
} catch (error) {
  core.setFailed(`Action failed with error ${error}`);
}
