const nodemailer = require('nodemailer');

const SMTP_HOST = process.env.SMTP_HOST || '';
const SMTP_PORT = process.env.SMTP_PORT || 587;
const SMTP_USER = process.env.SMTP_USER || '';
const SMTP_PASS = process.env.SMTP_PASS || '';
const FROM_EMAIL = process.env.FROM_EMAIL || 'orders@visionsbymon.com';
const STORE_OWNER_EMAIL = process.env.STORE_OWNER_EMAIL || process.env.ADMIN_EMAIL || FROM_EMAIL;

let transporter = null;

if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS
    }
  });
}

/**
 * Send Order Confirmation Email to Customer
 */
async function sendOrderConfirmationEmail({ orderId, customerName, customerEmail, totalAmount, items, shippingAddress, city, paymentMethod = 'Cash on Delivery' }) {
  const itemsHtml = (items || []).map(item => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.title || 'Luxury Item'} (${item.selectedSize || item.size || 'M'})</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">₹${item.price}</td>
    </tr>
  `).join('');

  const htmlContent = `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; padding: 24px;">
      <h2 style="color: #111111; margin-top: 0; letter-spacing: 2px; text-transform: uppercase;">Visionsby_MON</h2>
      <hr style="border: none; border-top: 1px solid #eeeeee;" />
      <h3 style="color: #2e7d32;">Order Placed Successfully! (${paymentMethod})</h3>
      <p>Dear <strong>${customerName}</strong>,</p>
      <p>Thank you for shopping with Visionsby_MON. Your order <strong>${orderId}</strong> has been received and is being prepared.</p>
      
      <table style="width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 14px;">
        <thead>
          <tr style="background: #f8f9fa;">
            <th style="padding: 8px; text-align: left;">Item</th>
            <th style="padding: 8px; text-align: center;">Qty</th>
            <th style="padding: 8px; text-align: right;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>

      <h3 style="text-align: right; margin-top: 16px;">Total Amount (COD): ₹${totalAmount}</h3>

      <div style="background: #f8f9fa; padding: 12px; border-radius: 4px; margin-top: 20px; font-size: 13px;">
        <strong>Payment Method:</strong> ${paymentMethod}<br/>
        <strong>Delivery Address:</strong><br/>
        ${shippingAddress}, ${city}
      </div>

      <p style="font-size: 12px; color: #777777; margin-top: 24px; text-align: center;">
        Visionsby_MON Luxury Boutique &bull; Support: support@visionsbymon.com
      </p>
    </div>
  `;

  if (transporter) {
    try {
      await transporter.sendMail({
        from: `"Visionsby_MON" <${FROM_EMAIL}>`,
        to: customerEmail,
        subject: `Order Confirmation - ${orderId}`,
        html: htmlContent
      });
      console.log(`[EMAIL] Sent customer order receipt for ${orderId} to ${customerEmail}`);
    } catch (err) {
      console.warn(`[EMAIL WARNING] Failed to send customer email to ${customerEmail}:`, err.message);
    }
  } else {
    console.log(`[EMAIL DEV LOG] Customer order receipt generated for ${orderId} to ${customerEmail} (Total: ₹${totalAmount})`);
  }
}

/**
 * Send Store Owner Alert Email when a new purchase occurs
 */
async function sendStoreOwnerOrderNotification({ orderId, customerName, customerEmail, totalAmount, items, shippingAddress, city, zip, paymentMethod = 'Cash on Delivery' }) {
  const itemsHtml = (items || []).map(item => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>${item.title || 'Luxury Item'}</strong> (Size: ${item.selectedSize || item.size || 'M'}, Color: ${item.selectedColor || 'Standard'})</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">₹${item.price * item.quantity}</td>
    </tr>
  `).join('');

  const htmlContent = `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 650px; margin: 0 auto; background: #ffffff; border: 2px solid #111; border-radius: 8px; padding: 24px;">
      <div style="background: #111; color: #fff; padding: 12px 16px; margin: -24px -24px 20px -24px; border-top-left-radius: 6px; border-top-right-radius: 6px;">
        <h2 style="margin: 0; font-size: 18px; letter-spacing: 1px;">🛍️ NEW STORE PURCHASE ALERT</h2>
      </div>

      <h3 style="color: #111; margin-top: 0;">Order ID: ${orderId}</h3>
      <p style="font-size: 14px; color: #333;">A customer just placed a new order on <strong>Visionsby_MON</strong> using <strong>${paymentMethod}</strong>.</p>
      
      <div style="background: #f8f9fa; padding: 14px; border-radius: 6px; margin-bottom: 20px; font-size: 14px; line-height: 1.6;">
        <h4 style="margin: 0 0 8px 0; color: #111;">👤 Customer Details:</h4>
        <strong>Name:</strong> ${customerName}<br/>
        <strong>Email:</strong> ${customerEmail}<br/>
        <strong>Shipping Address:</strong> ${shippingAddress}, ${city}, ${zip}<br/>
        <strong>Payment Method:</strong> <span style="background: #e2e8f0; padding: 2px 6px; border-radius: 4px; font-weight: bold;">${paymentMethod}</span>
      </div>

      <h4 style="margin: 0 0 8px 0; color: #111;">📦 Ordered Items:</h4>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px; font-size: 14px;">
        <thead>
          <tr style="background: #f1f5f9;">
            <th style="padding: 8px; text-align: left;">Item Description</th>
            <th style="padding: 8px; text-align: center;">Qty</th>
            <th style="padding: 8px; text-align: right;">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>

      <div style="text-align: right; font-size: 18px; font-weight: bold; color: #111; padding-top: 10px; border-top: 2px solid #eee;">
        Total Collectable Amount: ₹${totalAmount}
      </div>

      <p style="font-size: 12px; color: #666; margin-top: 24px; text-align: center; border-top: 1px solid #eee; padding-top: 12px;">
        Visionsby_MON Order Notification System &bull; Automatically generated upon store checkout.
      </p>
    </div>
  `;

  console.log(`\n==================================================`);
  console.log(`[STORE OWNER EMAIL ALERT] New Order Received!`);
  console.log(`Order ID: ${orderId}`);
  console.log(`Customer: ${customerName} (${customerEmail})`);
  console.log(`Total COD Amount: ₹${totalAmount}`);
  console.log(`Notification sent to: ${STORE_OWNER_EMAIL}`);
  console.log(`==================================================\n`);

  if (transporter) {
    try {
      await transporter.sendMail({
        from: `"Visionsby_MON Store" <${FROM_EMAIL}>`,
        to: STORE_OWNER_EMAIL,
        subject: `🚨 NEW PURCHASE: Order ${orderId} - ₹${totalAmount} (${paymentMethod})`,
        html: htmlContent
      });
      console.log(`[EMAIL] Successfully sent order alert to store owner: ${STORE_OWNER_EMAIL}`);
    } catch (err) {
      console.warn(`[EMAIL WARNING] Failed to send store owner alert to ${STORE_OWNER_EMAIL}:`, err.message);
    }
  }
}

module.exports = {
  sendOrderConfirmationEmail,
  sendStoreOwnerOrderNotification
};

