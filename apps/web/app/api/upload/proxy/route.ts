// biome-ignore lint/performance/noBarrelFile: Next route wrapper for the shared bucket handler.
export {
  proxySignedUploadRequest as DELETE,
  proxySignedUploadRequest as POST,
  proxySignedUploadRequest as PUT,
} from "@xbase/bucket/next";
