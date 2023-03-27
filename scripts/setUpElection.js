const { ethers, getNamedAccounts, deployments } = require("hardhat");

async function main() {
  const { deployer } = await getNamedAccounts();
  const dBallot = await ethers.getContract("DBallot", deployer);

  // Add candidates
  await dBallot.addCandidate("APC", "Description A", "Logo Url A");
  await dBallot.addCandidate("LP", "Description B", "Logo Url B");
  await dBallot.addCandidate("PDP", "Description C", "Logo Url C");

  // Declare the election
  const now = Math.floor(Date.now() / 1000);
  await dBallot.declareElection(now);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
