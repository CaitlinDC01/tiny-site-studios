export async function validSignature(raw:string, signature:string, secret:string, notificationURL:string) {
  const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign']);
  const bytes=new Uint8Array(await crypto.subtle.sign('HMAC',key,new TextEncoder().encode(notificationURL+raw)));
  const expected=btoa(String.fromCharCode(...bytes));
  if(signature.length!==expected.length)return false;
  let difference=0;for(let i=0;i<expected.length;i++)difference|=signature.charCodeAt(i)^expected.charCodeAt(i);
  return difference===0;
}
export function matchesPayment(payment:any, order:any, checkout:any, locationId:string) {
  return checkout.environment==='production' && payment.status==='COMPLETED' &&
    payment.order_id===order.id && order.reference_id===checkout.purchase_ref &&
    (!checkout.order_id||checkout.order_id===order.id) &&
    payment.location_id===locationId && order.location_id===locationId &&
    payment.amount_money?.amount===checkout.price_cents && payment.amount_money?.currency==='USD' &&
    order.total_money?.amount===checkout.price_cents && order.total_money?.currency==='USD' &&
    !(payment.refunded_money?.amount>0);
}
