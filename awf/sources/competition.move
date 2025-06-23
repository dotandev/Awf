module awf::competition {

    use sui::object::{Self, UID};
    use sui::tx_context::TxContext;
    use sui::event;

    struct Competition has key {
        id: UID,
        name: vector<u8>,
        rules_uri: vector<u8>,
        host: address,
        is_open: bool,
    }

    struct Participant has key {
        id: UID,
        competition_id: ID,
        participant: address,
    }

    struct Submission has key {
        id: UID,
        competition_id: ID,
        participant: address,
        entry_uri: vector<u8>,
        timestamp: u64,
    }

    /// Event emitted when a competition is created
    struct CompetitionCreated has drop {
        host: address,
        name: vector<u8>,
        rules_uri: vector<u8>,
    }

    /// Create a new competition
    public fun create_competition(
        name: vector<u8>,
        rules_uri: vector<u8>,
        ctx: &mut TxContext
    ): Competition {
        let id = object::new(ctx);
        let host = tx_context::sender(ctx);

        event::emit(CompetitionCreated {
            host,
            name: name.clone(),
            rules_uri: rules_uri.clone(),
        });

        Competition {
            id,
            name,
            rules_uri,
            host,
            is_open: true
        }
    }

    /// Register a participant
    public fun register_participant(
        competition: &Competition,
        ctx: &mut TxContext
    ): Participant {
        assert!(competition.is_open, 0);
        Participant {
            id: object::new(ctx),
            competition_id: object::id(&competition.id),
            participant: tx_context::sender(ctx),
        }
    }

    /// Submit an entry
    public fun submit_entry(
        competition: &Competition,
        entry_uri: vector<u8>,
        timestamp: u64,
        ctx: &mut TxContext
    ): Submission {
        assert!(competition.is_open, 1);

        Submission {
            id: object::new(ctx),
            competition_id: object::id(&competition.id),
            participant: tx_context::sender(ctx),
            entry_uri,
            timestamp,
        }
    }

    /// Close a competition (host only)
    public fun close_competition(
        competition: &mut Competition,
        ctx: &TxContext
    ) {
        assert!(tx_context::sender(ctx) == competition.host, 2);
        competition.is_open = false;
    }
}
