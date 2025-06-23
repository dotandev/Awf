module awf::competition {
    use sui::object::{Self, UID, ID};
    use sui::tx_context::{Self, TxContext};
    use sui::event;
    use sui::vec_map::{Self, VecMap}; // Added for leaderboard management
    use sui::transfer; // Added for object ownership control
    use sui::clock::{Self, Clock}; // Added for reliable timestamping

    // Custom error codes for better debugging
    const ECompetitionClosed: u64 = 1; // Competition is not open
    const ENotHost: u64 = 2;          // Caller is not the host
    const EAlreadyRegistered: u64 = 3; // Participant already registered
    const EInvalidTimestamp: u64 = 4;  // Invalid timestamp provided
    const ENoParticipants: u64 = 5;    // No participants to distribute rewards

    // Competition object, shared for multi-user access
    struct Competition has key, store { // Added store trait for flexibility
        id: UID,
        name: vector<u8>,
        rules_uri: u64, // off-chain reference
        host: address,
        is_open: bool,
        leaderboard: VecMap<address, u64>, // Added to track participant scores
        reward_pool: u64, // Added to track total rewards
    }

    // Participant object, owned by the user
    struct Participant has key, store {
        id: UID,
        competition_id: ID,
        participant: address,
        score: u64, // Added to track individual score
    }

    // Submission object, owned by the competition
    struct Submission has key, store {
        id: UID,
        competition_id: ID,
        participant: address,
        entry_uri: u64, // off-chain reference
        timestamp: u64,
    }

    // Reward object for winners
    struct Reward has key, store { // Added for reward distribution
        id: UID,
        competition_id: ID,
        recipient: address,
        amount: u64,
        claimed: bool,
    }

    // Event emitted when a competition is created
    struct CompetitionCreated has copy, drop { // Added copy trait for flexibility
        competition_id: ID, // Added for off-chain indexing
        host: address,
        name: vector<u8>,
        rules_uri: u64,
    }

    // Event emitted when a participant registers
    struct ParticipantRegistered has copy, drop { // Added for tracking
        competition_id: ID,
        participant: address,
    }

    // Event emitted when an entry is submitted
    struct EntrySubmitted has copy, drop { // Added for tracking
        competition_id: ID,
        participant: address,
        entry_uri: u64,
        score: u64, // Added to include score in event
    }

    // Event emitted when rewards are distributed
    struct RewardsDistributed has copy, drop { // Added for reward tracking
        competition_id: ID,
        recipients: vector<address>,
        amounts: vector<u64>,
    }

    // Create a new competition
    public fun create_competition(
        name: vector<u8>,
        rules_uri: u64, 
        reward_pool: u64, // Added to initialize reward pool
        ctx: &mut TxContext
    ): ID { // Changed return type to ID for off-chain reference
        let id = object::new(ctx);
        let competition_id = object::uid_to_inner(&id); // Added for event emission
        let host = tx_context::sender(ctx);

        let competition = Competition {
            id,
            name,
            rules_uri,
            host,
            is_open: true,
            leaderboard: vec_map::empty(), // Initialized leaderboard
            reward_pool,
        };

        event::emit(CompetitionCreated {
            competition_id,
            host,
            name,
            rules_uri,
        });

        transfer::share_object(competition); // Changed to share_object for multi-user access
        competition_id // Return ID for off-chain tracking
    }

    // Register a participant
    public fun register_participant(
        competition: &mut Competition, // Changed to mutable to update leaderboard
        ctx: &mut TxContext
    ): Participant {
        assert!(competition.is_open, ECompetitionClosed); // Updated error code
        let participant_addr = tx_context::sender(ctx);
        // Check if already registered to prevent duplicates
        assert!(!vec_map::contains(&competition.leaderboard, &participant_addr), EAlreadyRegistered);

        let participant = Participant {
            id: object::new(ctx),
            competition_id: object::id(&competition.id),
            participant: participant_addr,
            score: 0, // Initialize score
        };

        // Add to leaderboard with initial score of 0
        vec_map::insert(&mut competition.leaderboard, participant_addr, 0);

        event::emit(ParticipantRegistered {
            competition_id: object::id(&competition.id),
            participant: participant_addr,
        });

        participant
    }

    // Submit an entry
    public fun submit_entry(
        competition: &mut Competition, // Changed to mutable to update leaderboard
        entry_uri: u64, // Changed to u64 for consistency
        score: u64, // Added to record participant score
        clock: &Clock, // Added for reliable timestamping
        ctx: &mut TxContext
    ): Submission {
        assert!(competition.is_open, ECompetitionClosed); // Updated error code
        let participant_addr = tx_context::sender(ctx);
        // Ensure participant is registered
        assert!(vec_map::contains(&competition.leaderboard, &participant_addr), EAlreadyRegistered);

        let timestamp = clock::timestamp_ms(clock); // Use Clock for accurate timestamp
        let submission = Submission {
            id: object::new(ctx),
            competition_id: object::id(&competition.id),
            participant: participant_addr,
            entry_uri,
            timestamp,
        };

        // Update participant's score in leaderboard
        let current_score = *vec_map::get(&competition.leaderboard, &participant_addr);
        vec_map::insert(&mut competition.leaderboard, participant_addr, current_score + score);

        event::emit(EntrySubmitted {
            competition_id: object::id(&competition.id),
            participant: participant_addr,
            entry_uri,
            score,
        });

        // Transfer submission to competition for ownership
        transfer::transfer(submission, competition.host); // Changed to transfer to host
        submission
    }

    // Close a competition (host only)
    public fun close_competition(
        competition: &mut Competition,
        ctx: &TxContext
    ) {
        assert!(tx_context::sender(ctx) == competition.host, ENotHost); // Updated error code
        competition.is_open = false;
    }

    // Distribute rewards (host only)
    public fun distribute_rewards(
        competition: &mut Competition,
        ctx: &mut TxContext
    ): vector<Reward> { // Added for reward distribution
        assert!(tx_context::sender(ctx) == competition.host, ENotHost); // Updated error code
        assert!(!competition.is_open, ECompetitionClosed); // Ensure competition is closed
        assert!(vec_map::size(&competition.leaderboard) > 0, ENoParticipants); // Ensure participants exist

        let mut rewards = vector::empty<Reward>();
        let mut recipients = vector::empty<address>();
        let mut amounts = vector::empty<u64>();
        let pool = competition.reward_pool;
        let participant_count = vec_map::size(&competition.leaderboard);

        // Simplified reward distribution: divide pool equally among top participants
        let reward_per_participant = pool / participant_count;

        let mut i = 0;
        while (i < participant_count) {
            let (participant_addr, score) = vec_map::get_idx(&competition.leaderboard, i);
            if (score > 0) { // Only reward participants with non-zero scores
                let reward = Reward {
                    id: object::new(ctx),
                    competition_id: object::id(&competition.id),
                    recipient: participant_addr,
                    amount: reward_per_participant,
                    claimed: false,
                };
                vector::push_back(&mut rewards, reward);
                vector::push_back(&mut recipients, participant_addr);
                vector::push_back(&mut amounts, reward_per_participant);
            };
            i = i + 1;
        };

        event::emit(RewardsDistributed {
            competition_id: object::id(&competition.id),
            recipients,
            amounts,
        });

        competition.reward_pool = 0; // Clear reward pool
        rewards
    }

    // Claim a reward
    public fun claim_reward(
        reward: &mut Reward,
        ctx: &mut TxContext
    ) { // Added for reward claiming
        assert!(!reward.claimed, 6); // Ensure reward is unclaimed
        assert!(tx_context::sender(ctx) == reward.recipient, 7); // Ensure caller is recipient
        reward.claimed = true;
        
    }
}