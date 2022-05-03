const core = require("@actions/core");
const github = require("@actions/github");
const fs = require("fs");

const main = async () => {
  const token = core.getInput("token");
  if (!token) {
    throw new Error(`No token provided`);
  }
  const octokit = github.getOctokit(token);
  const { payload } = github.context;
  const { repository } = payload;
  const { name: owner } = repository.owner;
  const { name: repo } = repository;
  const refs = payload.commits.map((commit) => commit.id);

  const files = await Promise.all(
    refs.map(async (ref) => {
      const commit = await octokit.request(
        `GET /repos/${owner}/${repo}/commits/${ref}`
      );
      console.log(`Commit: ${JSON.stringify(commit, undefined, 2)}`);
      return commit.files;
    })
  );
  const services = core.getInput("services");
  const time = new Date().toTimeString();
  core.setOutput("time", time);
  console.log(`Services : ${services}`);
  //console.log(`Files updated are: ${JSON.stringify(files)}`);
  console.log(`The event payload: ${JSON.stringify(payload, undefined, 2)}`);
};

try {
  main();
} catch (error) {
  core.setFailed(`Action failed with error ${error}`);
}
