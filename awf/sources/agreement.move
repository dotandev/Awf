module awf::agreement {
    use sui::object::{Self, UID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;
    use sui::vec_map::{Self, VecMap};
    use sui::event;

    // Agreement object
    public struct Agreement has key, store {
        id: UID,
        is_signed_by_creator: bool,
        is_signed_by_second_party: bool,
        parties: VecMap<address, bool>,
        terms_hash: vector<u8>,
        playback_data: vector<u8>,
        zka_verified: bool,
        verifiers: VecMap<address, bool>,
    }

    // Event for agreement creation
    public struct AgreementCreated has copy, drop {
        agreement_id: ID,
        creator: address,
    }

    // Create a new agreement
    public entry fun create_agreement(
        terms_hash: vector<u8>,
        playback_data: vector<u8>,
        party_addresses: vector<address>,
        ctx: &mut TxContext
    ) {
        let mut parties = vec_map::empty<address, bool>();
        let mut num = 0;
        while (num < vector::length(&party_addresses)) {
            vec_map::insert(&mut parties, *vector::borrow(&party_addresses, num), false);
            num = num + 1;
        };
        let agreement = Agreement {
            id: object::new(ctx),
            parties,
            is_signed_by_creator: false,
            is_signed_by_second_party: false,
            terms_hash,
            playback_data,
            zka_verified: false,
            verifiers: vec_map::empty(),
        };
        let agreement_id = object::uid_to_inner(&agreement.id);
        event::emit(AgreementCreated { agreement_id, creator: tx_context::sender(ctx) });
        transfer::share_object(agreement);
    }

    // Sign agreement
    public entry fun sign_agreement(agreement: &mut Agreement, ctx: &TxContext) {
        let sender = tx_context::sender(ctx);
        assert!(vec_map::contains(&agreement.parties, &sender), 100);
        if (sender == *vector::borrow(&agreement.parties.keys(), 0)) {
            agreement.is_signed_by_creator = true;
        } else if (sender == *vector::borrow(&agreement.parties.keys(), 1)) {
            agreement.is_signed_by_second_party = true;
        };
    }

    // Verify party using ZKA (simplified Schnorr-based)
    public entry fun verify_party(agreement: &mut Agreement, proof: vector<u8>, ctx: &TxContext) {
        let sender = tx_context::sender(ctx);
        assert!(vec_map::contains(&agreement.parties, &sender), 100);
        // Placeholder: Verify Schnorr ZKP proof (off-chain generated)
        // Example: proof validates sender matches biometric/attestation
        agreement.parties.entry(sender).or_insert(true);
        if (agreement.is_signed_by_creator && agreement.is_signed_by_second_party) {
            agreement.zka_verified = true;
        };
    }

    // Grant playback access
    public entry fun grant_playback_access(
        agreement: &mut Agreement,
        verifier: address,
        ctx: &TxContext
    ) {
        let sender = tx_context::sender(ctx);
        assert!(vec_map::contains(&agreement.parties, &sender), 100);
        vec_map::insert(&mut agreement.verifiers, verifier, true);
    }

    // Access playback data
    public fun get_playback_data(agreement: &Agreement, requester: address): vector<u8> {
        assert!(vec_map::contains(&agreement.verifiers, &requester), 101);
        assert!(agreement.zka_verified, 102);
        agreement.playback_data
    }
}