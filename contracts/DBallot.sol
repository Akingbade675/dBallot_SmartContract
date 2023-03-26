// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

/* Errors */
error DBallot__NotOwner();
error DBallot__VoterHasVoted();
error DBallot__InvalidCandidate();
error DBallot__VotingPeriodHasEnded();

/**
 * @title DBallot
 * @author Abdulbasit Akingbade
 * @dev A simple voting contract
 */
contract DBallot {
    address private immutable i_owner;
    uint256 public s_nextElectionDate;
    uint256 public s_votingPeriod;
    uint256 public s_totalCandidatesCount;
    uint256 public s_totalVotes;

    mapping(uint256 => Candidate) public s_candidates;
    mapping(address => Voter) public s_voters;

    struct Candidate {
        uint256 id;
        string partyName;
        string description;
        string logoUrl;
        uint256 voteCount;
    }

    struct Voter {
        bool hasVoted;
        uint256 candidateId;
    }

    /* Modifiers */
    modifier onlyOwner() {
        if (msg.sender != i_owner) revert DBallot__NotOwner();
        _;
    }

    modifier onlyDuringVotingPeriod() {
        if (
            block.timestamp > s_nextElectionDate &&
            block.timestamp < s_nextElectionDate + s_votingPeriod
        ) revert DBallot__VotingPeriodHasEnded();
        _;
    }

    /**
     * @param _nextElectionDate the next election date in seconds
     * @param _votingPeriod the voting period in seconds
     */
    constructor(uint256 _nextElectionDate, uint256 _votingPeriod) {
        i_owner = msg.sender;
        s_nextElectionDate = _nextElectionDate;
        s_votingPeriod = _votingPeriod;
    }

    // add candidates
    /**
     * @param _partyName the name of the party
     * @param _description the description of the party
     * @param _logoUrl the url of the party logo
     */
    function addCandidate(
        string memory _partyName,
        string memory _description,
        string memory _logoUrl
    ) public onlyOwner {
        Candidate memory candidate = Candidate({
            id: s_totalCandidatesCount,
            partyName: _partyName,
            description: _description,
            logoUrl: _logoUrl,
            voteCount: 0
        });
        s_totalCandidatesCount++;
        s_candidates[candidate.id] = candidate;
    }

    // vote
    /**
     * @param _candidateId the id of the candidate
     */
    function castVote(uint256 _candidateId) public onlyDuringVotingPeriod {
        // require that they haven't voted before
        if (s_voters[msg.sender].hasVoted) revert DBallot__VoterHasVoted();
        // require a valid candidate
        if (_candidateId >= s_totalCandidatesCount)
            revert DBallot__InvalidCandidate();
        // record that voter has voted
        s_voters[msg.sender] = Voter({
            hasVoted: true,
            candidateId: _candidateId
        });
        // update candidate vote Count
        s_candidates[_candidateId].voteCount++;
        s_totalVotes++;
    }

    // get results
    function getResults() public view returns (Candidate[] memory) {
        Candidate[] memory results = new Candidate[](s_totalCandidatesCount);
        for (uint256 i = 0; i < s_totalCandidatesCount; i++) {
            results[i] = s_candidates[i];
        }
        return results;
    }

    /* Setters */
    function setNextElectionDate(uint256) public view returns (uint256) {
        return s_nextElectionDate;
    }

    /* View / Pure functions */
    function getNextElectionDate() public view returns (uint256) {
        return s_nextElectionDate;
    }
}
