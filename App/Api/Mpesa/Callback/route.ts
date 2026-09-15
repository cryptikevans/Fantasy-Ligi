import { db } from "@/lib/prisma";
import { creditWallet } from "@/lib/wallet";

export async function POST(req: Request) {
  const payload = await req.json();
  const body = payload?.Body?.stkCallback;
  if (!body) return Response.json({error:"Invalid callback"}, {status:400});
  const checkoutId = body.CheckoutRequestID as string | undefined;
  const resultCode = Number(body.ResultCode);
  const existing = checkoutId ? await db.mpesaCallback.findUnique({where:{checkoutId}}) : null;
  if (existing?.processed) return Response.json({ResultCode:0,ResultDesc:"Already processed"});

  const callback = await db.mpesaCallback.create({
    data:{checkoutId, resultCode, rawPayload:payload}
  });

  // Production implementation must map CheckoutRequestID to a pending deposit
  // transaction created by the STK endpoint. Never trust amount/phone from the client.
  if (resultCode !== 0) {
    await db.mpesaCallback.update({where:{id:callback.id},data:{processed:true}});
    return Response.json({ResultCode:0,ResultDesc:"Callback recorded"});
  }

  const items = body.CallbackMetadata?.Item ?? [];
  const amount = Number(items.find((x:any)=>x.Name==="Amount")?.Value ?? 0);
  const receipt = String(items.find((x:any)=>x.Name==="MpesaReceiptNumber")?.Value ?? "");
  const merchantRef = String(body.AccountReference ?? "");

  // TODO: look up the pending deposit by checkoutId and credit that exact user/amount.
  await db.mpesaCallback.update({where:{id:callback.id},data:{processed:true,mpesaReceipt:receipt,merchantRef}});
  return Response.json({ResultCode:0,ResultDesc:`Callback accepted for ${amount}`});
}
