import { defineTool } from "eve/tools";
import { z } from "zod";

export default defineTool({
  description:
    "Get the current date and time, optionally in a specific IANA time zone (e.g. 'Europe/Paris'). Defaults to UTC.",
  inputSchema: z.object({
    timeZone: z
      .string()
      .min(1)
      .optional()
      .describe("IANA time zone identifier. Defaults to UTC."),
  }),
  execute({ timeZone }) {
    const zone = timeZone ?? "UTC";
    const now = new Date();
    const formatted = new Intl.DateTimeFormat("en-US", {
      dateStyle: "full",
      timeStyle: "long",
      timeZone: zone,
    }).format(now);
    return { iso: now.toISOString(), timeZone: zone, formatted };
  },
});
