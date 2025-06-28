import { SuiClient, getFullnodeUrl } from "@mysten/sui/client";
import { Transaction } from "@mysten/sui/transactions";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { bcs } from "@mysten/sui/bcs";

/** Sui client configuration */
export const suiClient = new SuiClient({
  url: getFullnodeUrl("testnet"),
});

export const PACKAGE_ID = "0x..."; // Replace with your package ID
export const MODULE_NAME = "agreement";

/** Utility: Convert hex string to Uint8Array */
function hexToBytes(hex: string): Uint8Array {
  return new Uint8Array(Buffer.from(hex.replace(/^0x/, ""), "hex"));
}

/** Utility: Convert UTF-8 string to Uint8Array */
function utf8ToBytes(str: string): Uint8Array {
  return new Uint8Array(Buffer.from(str, "utf8"));
}

/** Transaction result interface */
interface TxResult {
  success: boolean;
  transactionDigest?: string;
  events?: any[];
  error?: string;
}

/** Playback data result interface */
interface PlaybackResult {
  success: boolean;
  data?: any;
  error?: string;
}

/** Agreement fetch result interface */
interface AgreementResult {
  success: boolean;
  agreement?: any;
  error?: string;
}

export class AgreementContract {
  /**
   * Create a new agreement on-chain.
   */
  static async createAgreement(
    termsHash: string,
    playbackData: string,
    partyAddresses: string[],
    signer: Ed25519Keypair
  ): Promise<TxResult> {
    const tx = new Transaction();
    const termsHashBytes = hexToBytes(termsHash);
    const playbackDataBytes = utf8ToBytes(playbackData);

    const partiesBytes = partyAddresses.map(address => hexToBytes(address));
    // Correct usage: just pass the data, no type argument
    const termsArg = tx.pure(termsHashBytes);
    const playbackArg = tx.pure(playbackDataBytes);
    const partiesArg = tx.pure(bcs.vector(bcs.vector(bcs.u8())).serialize(partiesBytes));

    tx.moveCall({
      target: `${PACKAGE_ID}::${MODULE_NAME}::create_agreement`,
      arguments: [termsArg, playbackArg, partiesArg],
    });

    try {
      const result = await suiClient.signAndExecuteTransaction({
        signer,
        transaction: tx,
        options: {
          showEffects: true,
          showEvents: true,
        },
      });

      return {
        success: true,
        transactionDigest: result.digest,
        events: result.events ?? undefined, // avoid null assignment
      };
    } catch (error: any) {
      console.error("Error creating agreement:", error?.message || error);
      return { success: false, error: error?.message || "Unknown error" };
    }
  }

  /**
   * Grant playback access to a verifier.
   */
  static async grantPlaybackAccess(
    agreementId: string,
    verifierAddress: string,
    signer: Ed25519Keypair
  ): Promise<TxResult> {
    const tx = new Transaction();

    const verifierAddressBytes = hexToBytes(verifierAddress);
    tx.moveCall({
      target: `${PACKAGE_ID}::${MODULE_NAME}::grant_playback_access`,
      arguments: [tx.object(agreementId), tx.pure(verifierAddressBytes)],
    });

    try {
      const result = await suiClient.signAndExecuteTransaction({
        signer,
        transaction: tx,
        options: {
          showEffects: true,
        },
      });

      return {
        success: true,
        transactionDigest: result.digest,
      };
    } catch (error: any) {
      console.error("Error granting playback access:", error?.message || error);
      return { success: false, error: error?.message || "Unknown error" };
    }
  }

  /**
   * Simulate fetching playback data for a requester.
   */
  static async getPlaybackData(
    agreementId: string,
    requesterAddress: string
  ): Promise<PlaybackResult> {
    try {
      const tx = new Transaction();
      const requesterAddressBytes = hexToBytes(requesterAddress)
      tx.moveCall({
        target: `${PACKAGE_ID}::${MODULE_NAME}::get_playback_data`,
        arguments: [tx.object(agreementId), tx.pure(requesterAddressBytes)],
      });

      const result = await suiClient.devInspectTransactionBlock({
        transactionBlock: tx,
        sender: requesterAddress,
      });

      return {
        success: true,
        data: result.results?.[0]?.returnValues?.[0]?.[0],
      };
    } catch (error: any) {
      console.error("Error getting playback data:", error?.message || error);
      return { success: false, error: error?.message || "Unknown error" };
    }
  }

  /**
   * Fetch agreement object from the blockchain.
   */
  static async getAgreement(agreementId: string): Promise<AgreementResult> {
    try {
      const result = await suiClient.getObject({
        id: agreementId,
        options: {
          showContent: true,
          showType: true,
        },
      });

      if (result.data?.content?.dataType === "moveObject") {
        return {
          success: true,
          agreement: result.data.content.fields,
        };
      }

      return {
        success: false,
        error: "Agreement not found",
      };
    } catch (error: any) {
      console.error("Error fetching agreement:", error?.message || error);
      return { success: false, error: error?.message || "Unknown error" };
    }
  }
}
