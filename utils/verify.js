const { run } = require("hardhat");

const verify = async (contractAddress, args) => {
  console.log("Verifying contract on Etherscan...");
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    });
  } catch (e) {
    if (e.message.toLowerCase().includes("already verified")) {
      console.log("Contract already verified!");
    } else {
      console.log("Error verifying contract:", e.message);
    }
  }
};

module.exports = { verify };
