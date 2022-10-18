import { APIPingInteraction } from "discord-api-types/payloads/v9/_interactions/ping";
import {
  APIApplicationCommandInteraction,
  APIInteractionResponse,
  InteractionResponseType,
  InteractionType,
  MessageFlags,
} from "discord-api-types/v9";
import { verify } from "./verify";

export async function handleRequest(request: Request): Promise<Response> {
  if (
    !request.headers.get("X-Signature-Ed25519") ||
    !request.headers.get("X-Signature-Timestamp")
  )
    return Response.redirect("https://tristancamejo.com");
  if (!(await verify(request))) return new Response("", { status: 401 });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const raw = (await request.json()) as any;

  const interaction = raw as
    | APIPingInteraction
    | APIApplicationCommandInteraction;

  if (interaction.type === InteractionType.Ping)
    return respond({
      type: InteractionResponseType.Pong,
    });

  /**
   * Handle here
   */

  if (!interaction.data.resolved)
    return respond({
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        content: "Please update your client to use this command.",
        flags: MessageFlags.Ephemeral,
      },
    });

  return respond({
    type: InteractionResponseType.ChannelMessageWithSource,
    data: {
      content: "It seems like this interaction does not exist.",
      flags: MessageFlags.Ephemeral,
    },
  });
}

const respond = (response: APIInteractionResponse) =>
  new Response(JSON.stringify(response), {
    headers: { "content-type": "application/json" },
  });
