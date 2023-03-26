const { network } = require("hardhat");
const { developmentChains } = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  const nextElectionDate = Math.floor(new Date().getTime() / 1000) + 3600; // 1 hour from now
  const votingPeriod = 3600; // 1 hour

  const args = [nextElectionDate, votingPeriod];
  const dballot = await deploy("DBallot", {
    from: deployer,
    args,
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  });

  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    await verify(dballot.address, args);
  }
};

module.exports.tags = ["all", "dballot"];
