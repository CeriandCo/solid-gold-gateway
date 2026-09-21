/**
 * Manual run of the catalog safety net. Idempotent: when the mapping is
 * complete it only reports. Prints no secret.
 */
import { reassertCatalog } from "../src/lib/commerce/catalog-guard.server";

console.log(JSON.stringify(await reassertCatalog(), null, 2));
