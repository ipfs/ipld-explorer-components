export default function parseIpldPath(str: any): {
    namespace: string;
    cidOrFqdn: string;
    rest: string;
    address: string;
} | null;
export const pathRegEx: RegExp;
