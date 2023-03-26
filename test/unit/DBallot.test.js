const { assert, expect } = require("chai");
const { getNamedAccounts, deployments, ethers } = require("hardhat");

describe("DBallot", function () {
  let dBallot, deployer;

  beforeEach(async function () {
    deployer = (await getNamedAccounts()).deployer;
    await deployments.fixture("all");
    dBallot = await ethers.getContract("DBallot", deployer);
  });

  it("should add candidate", async function () {
    await dBallot.addCandidate("Party A", "Description A", "Logo Url A");
    const candidate = await dBallot.s_candidates(0);
    assert.equal(candidate.partyName, "Party A");
    assert.equal(candidate.description, "Description A");
    assert.equal(candidate.logoUrl, "Logo Url A");
    assert.equal(candidate.voteCount, 0);
    assert.equal(await dBallot.s_totalCandidatesCount(), 1);
  });

  it("should not add candidate if not owner", async function () {
    const notOwner = (await ethers.getSigners())[1];
    await expect(
      dBallot
        .connect(notOwner)
        .addCandidate("Party A", "Description A", "Logo Url A")
    ).to.be.reverted; /*With("DBallot__NotOwner");*/
    expect(await dBallot.s_totalCandidatesCount()).to.equal(0);
  });

  it("should cast vote", async function () {
    await dBallot.addCandidate("Party A", "Description A", "Logo Url A");
    let candidate = await dBallot.s_candidates(0);
    assert.equal(candidate.voteCount, 0);
    await dBallot.castVote(0);
    const voter = await dBallot.s_voters(deployer);
    candidate = await dBallot.s_candidates(0);
    assert.equal(voter.hasVoted, true);
    assert.equal(voter.candidateId.toString(), 0);
    assert.equal(candidate.voteCount.toString(), 1);
    assert.equal((await dBallot.s_totalVotes()).toString(), 1);
  });

  it("should not cast vote if not during voting period", async function () {
    await expect(dBallot.castVote(0)).to.be.reverted; /*With(
      "DBallot__VotingPeriodHasEnded"
    );*/
  });

  it("should not cast vote if already voted", async function () {
    await dBallot.addCandidate("Party A", "Description A", "Logo Url A");
    await dBallot.castVote(0);
    await expect(dBallot.castVote(0)).to.be.reverted; /*With(
      "DBallot__VoterHasVoted"
    );*/
  });

  it("should not cast vote if invalid candidate", async function () {
    await expect(dBallot.castVote(0)).to.be.reverted; /*With(
      "DBallot__InvalidCandidate"
    );*/
  });

  it("should get results", async function () {
    await dBallot.addCandidate("Party A", "Description A", "Logo Url A");
    await dBallot.addCandidate("Party B", "Description B", "Logo Url B");
    await dBallot.castVote(0);
    const signer1 = (await ethers.getSigners())[1];
    await dBallot.connect(signer1).castVote(1);
    const results = await dBallot.getResults();
    assert.equal(results[0].voteCount.toString(), 1);
    assert.equal(results[1].voteCount.toString(), 1);
  });
});
