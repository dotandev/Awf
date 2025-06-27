module awf::patent;

    use sui::event;

    public struct Patent has key, store {
        id: UID,
        hashed_code: vector<u8>,
        data: vector<u8>,
    }

    public struct PatentCreated has copy, drop {
        patent_id: ID,
        creator: address,
    }

    public fun create_patent(
        hashed_code: vector<u8>,
        data: vector<u8>,
        ctx: &mut TxContext
    ) {

        let new_patent = Patent {
            id: object::new(ctx),
            data,
            hashed_code,
        };
        let patent_id = object::uid_to_inner(&new_patent.id);
        event::emit(PatentCreated { patent_id, creator: tx_context::sender(ctx) });
        transfer::public_share_object(new_patent);
    }
