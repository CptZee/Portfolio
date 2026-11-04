import "server-only";

export function assetBase() {
    return process.env.AWS_ENDPOINT_URL_S3 ? `${process.env.AWS_ENDPOINT_URL_S3.replace(/\/$/, "")}/assets` : "";
}

export function resolveAsset(value: string) {
    if (!value.startsWith("storage:")) return value;
    const base = assetBase();
    if (!base) throw new Error("AWS_ENDPOINT_URL_S3 is required for portfolio assets.");
    return `${base}/${value.slice(8).split("/").map(encodeURIComponent).join("/")}`;
}
