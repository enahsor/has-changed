const core = require("@actions/core");
const github = require("@actions/github");
const fs = require("fs");

try {
  const services = core.getInput("services");
  const time = new Date().toTimeString();
  const payload = github.context.payload
  core.setOutput("time", time);
} catch (error) {
  core.setFailed(`Action failed with error ${error}`);
}
