const core = require("@actions/core");
const github = require("@actions/github");
const { join } = require("path");

const EXCLUDE = [".github/"];

const isFolder = (path) => {
  return path.includes("/");
};

const getBase = (path) => {
  if (isFolder(path)) {
    return path.split("/")[0];
  }
  return false;
};

const main = async () => {
  const root = core.getInput("services-root");
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
  const values = refs.map(async (ref) => {
    const commit = await octokit.request(
      `GET /repos/${owner}/${repo}/commits/${ref}`
    );
    return commit.data.files;
  });
  let files = (await Promise.all(values)).flat();

  // Get all directories not excluded
  files = files.filter(({ filename }) => {
    return isFolder(filename) && !EXCLUDE.includes(getBase(filename));
  });

  const affectedServices = files.map(({ filename }) => {
    return getBase(filename);
  });

  core.setOutput("affected-services", affectedServices);

  console.log(`Affected: ${JSON.stringify(affectedServices)}`);
  console.log(`The event payload: ${JSON.stringify(payload, undefined, 2)}`);
};

try {
  main();
} catch (error) {
  core.setFailed(`Action failed with error ${error}`);
}
