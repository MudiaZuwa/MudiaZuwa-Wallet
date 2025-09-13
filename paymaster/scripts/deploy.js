import hre from "hardhat";
const { ethers } = hre;

async function main() {
  // Configuration
  const ENTRYPOINT = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789"; // replace if needed
  const TOKEN = "0x3cd835bbd883cF6d3D45Ee4d0C1345e2AC5F6498"; // replace if needed
  const RATE = 1000;

  try {
    // 1️⃣ Check EntryPoint code
    const entryCode = await ethers.provider.getCode(ENTRYPOINT);
    if (entryCode === "0x") {
      throw new Error(`EntryPoint address ${ENTRYPOINT} is not a contract`);
    }
    console.log("✅ EntryPoint contract found");

    // 2️⃣ Check Token code
    const tokenCode = await ethers.provider.getCode(TOKEN);
    if (tokenCode === "0x") {
      throw new Error(`Token address ${TOKEN} is not a contract`);
    }
    console.log("✅ Token contract found");

    // 3️⃣ Deploy Paymaster
    const Paymaster = await ethers.getContractFactory("FixedRatePaymaster");

    const paymaster = await Paymaster.deploy(ENTRYPOINT, TOKEN, RATE, {
      gasLimit: 2_000_000,
    });

    await paymaster.waitForDeployment();

    console.log(paymaster);
    const paymasterAddress = await paymaster.getAddress();
    console.log("🚀 Paymaster deployed at:", paymasterAddress);
  } catch (err) {
    console.error("Deployment failed:", err);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
