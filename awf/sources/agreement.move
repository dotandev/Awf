module awf::agreement;
    use sui::object::{Self, UID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;
    use sui::vec_map::{Self, VecMap};

    // Agreement object
    public struct Agreement has key, store {
        id: UID,
        parties: VecMap<address, bool>, // Parties to the agreement
        terms_hash: vector<u8>, // Hash of agreement terms (e.g., text or audio)
        playback_data: vector<u8>, // Encrypted playback data (e.g., audio hash)
        zka_verified: bool, // Zero-knowledge authentication status
        verifiers: VecMap<address, bool>, // Authorized playback verifiers (e.g., arbitrators)
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
            terms_hash,
            playback_data,
            zka_verified: false, // Pending ZKA
            verifiers: vec_map::empty(),
        };
        transfer::share_object(agreement);
    }

    // Verify party using ZKA (placeholder)
    public entry fun verify_party(agreement: &mut Agreement, proof: vector<u8>, ctx: &TxContext) {
        // In practice, validate ZKP proof (e.g., party matches biometric/attestation)
        let sender = tx_context::sender(ctx);
        assert!(vec_map::contains(&agreement.parties, &sender), 100); // Simplified check
        // agreement.parties.entry(sender).or_insert(true); // Mark as verified
        agreement.zka_verified = true;
    }

    // Grant playback access to a verifier (e.g., arbitrator)
    public entry fun grant_playback_access(
        agreement: &mut Agreement,
        verifier: address,
        ctx: &TxContext
    ) {
        let sender = tx_context::sender(ctx);
        assert!(vec_map::contains(&agreement.parties, &sender), 100); // Only parties grant access
        vec_map::insert(&mut agreement.verifiers, verifier, true);
    }

    // Access playback data (for authorized verifiers)
    public fun get_playback_data(agreement: &Agreement, requester: address): vector<u8> {
        assert!(vec_map::contains(&agreement.verifiers, &requester), 101); // Check access
        assert!(agreement.zka_verified, 102); // Ensure ZKA-verified
        agreement.playback_data
    }