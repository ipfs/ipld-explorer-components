export function decodeCid(value: any): Promise<{
    cid: CID<unknown, number, number, import("multiformats").Version>;
    multibase: import("../../../node_modules/multiformats/dist/types/src/bases/base").Codec<"base256emoji", "🚀"> | import("../../../node_modules/multiformats/dist/types/src/bases/base").Codec<"base64", "m"> | import("../../../node_modules/multiformats/dist/types/src/bases/base").Codec<"base64pad", "M"> | import("../../../node_modules/multiformats/dist/types/src/bases/base").Codec<"base64url", "u"> | import("../../../node_modules/multiformats/dist/types/src/bases/base").Codec<"base64urlpad", "U"> | import("../../../node_modules/multiformats/dist/types/src/bases/base").Codec<"base58btc", "z"> | import("../../../node_modules/multiformats/dist/types/src/bases/base").Codec<"base58flickr", "Z"> | import("../../../node_modules/multiformats/dist/types/src/bases/base").Codec<"base36", "k"> | import("../../../node_modules/multiformats/dist/types/src/bases/base").Codec<"base36upper", "K"> | import("../../../node_modules/multiformats/dist/types/src/bases/base").Codec<"base32", "b"> | import("../../../node_modules/multiformats/dist/types/src/bases/base").Codec<"base32upper", "B"> | import("../../../node_modules/multiformats/dist/types/src/bases/base").Codec<"base32pad", "c"> | import("../../../node_modules/multiformats/dist/types/src/bases/base").Codec<"base32padupper", "C"> | import("../../../node_modules/multiformats/dist/types/src/bases/base").Codec<"base32hex", "v"> | import("../../../node_modules/multiformats/dist/types/src/bases/base").Codec<"base32hexupper", "V"> | import("../../../node_modules/multiformats/dist/types/src/bases/base").Codec<"base32hexpad", "t"> | import("../../../node_modules/multiformats/dist/types/src/bases/base").Codec<"base32hexpadupper", "T"> | import("../../../node_modules/multiformats/dist/types/src/bases/base").Codec<"base32z", "h"> | import("../../../node_modules/multiformats/dist/types/src/bases/base").Codec<"base16", "f"> | import("../../../node_modules/multiformats/dist/types/src/bases/base").Codec<"base16upper", "F"> | import("../../../node_modules/multiformats/dist/types/src/bases/base").Codec<"base10", "9"> | import("../../../node_modules/multiformats/dist/types/src/bases/base").Codec<"base8", "7"> | import("../../../node_modules/multiformats/dist/types/src/bases/base").Codec<"base2", "0"> | import("../../../node_modules/multiformats/dist/types/src/bases/base").Codec<"identity", "\0">;
    multicodec: {
        name: number;
    };
    multihash: {
        code: number;
        digest: Uint8Array;
        size: number;
        bytes: Uint8Array;
        name: "sha2-256" | "sha2-512" | "keccak-256" | "sha1" | "blake2b-512" | "sha3-512" | "blake3";
    };
} | undefined>;
import { CID } from 'multiformats';
