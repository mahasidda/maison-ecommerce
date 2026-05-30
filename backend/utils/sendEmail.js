const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const getDeliveryDates = () => {
  const min = new Date();
  const max = new Date();
  min.setDate(min.getDate() + 5);
  max.setDate(max.getDate() + 7);
  const options = { day: 'numeric', month: 'long', year: 'numeric' };
  return `${min.toLocaleDateString('en-IN', options)} — ${max.toLocaleDateString('en-IN', options)}`;
};

const sendOrderConfirmation = async (order, userEmail, userName) => {
  const itemsList = order.items.map(item =>
    `<tr>
      <td style="padding:8px;border-bottom:1px solid #f0ece6">${item.name}</td>
      <td style="padding:8px;border-bottom:1px solid #f0ece6;text-align:center">${item.quantity}</td>
      <td style="padding:8px;border-bottom:1px solid #f0ece6;text-align:right">₹${(item.price * item.quantity).toLocaleString()}</td>
    </tr>`
  ).join('');

  await transporter.sendMail({
    from: `"MAISON Fashion" <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: `Order Confirmed — #${order._id.toString().slice(-8).toUpperCase()}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f7f4ef">
        <div style="background:#0f0e0d;padding:30px;text-align:center">
          <h1 style="font-family:Georgia,serif;color:#f7f4ef;font-weight:300;letter-spacing:0.2em;margin:0;font-size:28px">MAISON</h1>
        </div>
        <div style="padding:40px 30px;background:#ffffff">
          <h2 style="font-family:Georgia,serif;font-weight:300;color:#0f0e0d">Thank you, ${userName}! 🎉</h2>
          <p style="color:#7a7570;font-size:15px;line-height:1.7">Your order has been placed successfully. We will notify you once it is shipped.</p>
          <div style="background:#f7f4ef;padding:15px 20px;border-left:3px solid #b5833a;margin:25px 0">
            <p style="margin:0;font-size:13px;color:#7a7570;text-transform:uppercase">Order ID</p>
            <p style="margin:5px 0 0;font-size:18px;font-weight:600;color:#0f0e0d">#${order._id.toString().slice(-8).toUpperCase()}</p>
          </div>
          <h3 style="font-family:Georgia,serif;font-weight:400;color:#0f0e0d">Order Items</h3>
          <table style="width:100%;border-collapse:collapse;font-size:14px">
            <thead>
              <tr style="background:#f7f4ef">
                <th style="padding:10px 8px;text-align:left;font-size:11px;color:#7a7570;text-transform:uppercase">Product</th>
                <th style="padding:10px 8px;text-align:center;font-size:11px;color:#7a7570;text-transform:uppercase">Qty</th>
                <th style="padding:10px 8px;text-align:right;font-size:11px;color:#7a7570;text-transform:uppercase">Price</th>
              </tr>
            </thead>
            <tbody>${itemsList}</tbody>
          </table>
          <div style="text-align:right;margin-top:15px;padding-top:15px;border-top:2px solid #f0ece6">
            <span style="font-size:16px;font-weight:600;color:#0f0e0d">Total: ₹${order.totalAmount.toLocaleString()}</span>
          </div>
          <div style="background:#fff8f0;border:1px solid #b5833a;padding:20px;margin-top:25px;border-radius:4px">
            <p style="color:#b5833a;font-size:15px;font-weight:600;margin:0">🚚 Estimated Delivery</p>
            <p style="color:#0f0e0d;font-size:16px;font-weight:600;margin:8px 0 0">${getDeliveryDates()}</p>
            <p style="color:#7a7570;font-size:13px;margin:6px 0 0">Standard delivery: 5–7 business days</p>
          </div>
          <h3 style="font-family:Georgia,serif;font-weight:400;color:#0f0e0d;margin-top:25px">Shipping Address</h3>
          <div style="background:#f7f4ef;padding:15px 20px;font-size:14px;color:#7a7570;line-height:1.8">
            <strong style="color:#0f0e0d">${order.shippingAddress.name}</strong><br/>
            ${order.shippingAddress.street}<br/>
            ${order.shippingAddress.city}, ${order.shippingAddress.state} — ${order.shippingAddress.pincode}<br/>
            📞 ${order.shippingAddress.phone}
          </div>
          <div style="margin-top:20px;padding:15px 20px;background:#f7f4ef;font-size:14px">
            <span style="color:#7a7570">Payment: </span>
            <strong style="color:#0f0e0d">${order.paymentMethod}</strong>
            ${order.isPaid ? ' ✅ Paid' : ' — Pay on delivery'}
          </div>
        </div>
        <div style="background:#0f0e0d;padding:25px;text-align:center">
          <p style="color:#6a6560;font-size:12px;margin:0">© 2026 MAISON. All rights reserved.</p>
          <p style="color:#6a6560;font-size:12px;margin:8px 0 0">Questions? Email us at ${process.env.EMAIL_USER}</p>
        </div>
      </div>
    `,
  });
  console.log('Order confirmation email sent to:', userEmail);
};

const sendOrderDelivered = async (order, userEmail, userName) => {
  const itemsList = order.items.map(item =>
    `<tr>
      <td style="padding:8px;border-bottom:1px solid #f0ece6">${item.name}</td>
      <td style="padding:8px;border-bottom:1px solid #f0ece6;text-align:center">${item.quantity}</td>
      <td style="padding:8px;border-bottom:1px solid #f0ece6;text-align:right">₹${(item.price * item.quantity).toLocaleString()}</td>
    </tr>`
  ).join('');

  await transporter.sendMail({
    from: `"MAISON Fashion" <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: `Your Order Has Been Delivered! 🎉 #${order._id.toString().slice(-8).toUpperCase()}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f7f4ef">
        <div style="background:#0f0e0d;padding:30px;text-align:center">
          <h1 style="font-family:Georgia,serif;color:#f7f4ef;font-weight:300;letter-spacing:0.2em;margin:0;font-size:28px">MAISON</h1>
        </div>
        <div style="padding:40px 30px;background:#ffffff">
          <div style="text-align:center;margin-bottom:25px">
            <div style="font-size:50px">📦✅</div>
            <h2 style="font-family:Georgia,serif;font-weight:300;color:#0f0e0d">Order Delivered!</h2>
            <p style="color:#7a7570;font-size:15px;line-height:1.7">Hi ${userName}, your order has been successfully delivered. We hope you love your new items!</p>
          </div>
          <div style="background:#f7f4ef;padding:15px 20px;border-left:3px solid #27ae60;margin:25px 0">
            <p style="margin:0;font-size:13px;color:#7a7570;text-transform:uppercase">Order ID</p>
            <p style="margin:5px 0 0;font-size:18px;font-weight:600;color:#0f0e0d">#${order._id.toString().slice(-8).toUpperCase()}</p>
          </div>
          <h3 style="font-family:Georgia,serif;font-weight:400;color:#0f0e0d">Delivered Items</h3>
          <table style="width:100%;border-collapse:collapse;font-size:14px">
            <thead>
              <tr style="background:#f7f4ef">
                <th style="padding:10px 8px;text-align:left;font-size:11px;color:#7a7570;text-transform:uppercase">Product</th>
                <th style="padding:10px 8px;text-align:center;font-size:11px;color:#7a7570;text-transform:uppercase">Qty</th>
                <th style="padding:10px 8px;text-align:right;font-size:11px;color:#7a7570;text-transform:uppercase">Price</th>
              </tr>
            </thead>
            <tbody>${itemsList}</tbody>
          </table>
          <div style="text-align:right;margin-top:15px;padding-top:15px;border-top:2px solid #f0ece6">
            <span style="font-size:16px;font-weight:600;color:#0f0e0d">Total: ₹${order.totalAmount.toLocaleString()}</span>
          </div>
          <div style="background:#f0faf5;border:1px solid #27ae60;padding:20px;margin-top:25px;text-align:center;border-radius:4px">
            <p style="color:#27ae60;font-size:15px;font-weight:600;margin:0">✅ Successfully Delivered</p>
            <p style="color:#7a7570;font-size:13px;margin:8px 0 0">Delivered on ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>
          <div style="text-align:center;margin-top:30px">
            <a href="https://maison-ecommerce-snowy.vercel.app/products" style="background:#b5833a;color:#ffffff;padding:14px 32px;text-decoration:none;font-size:13px;letter-spacing:0.12em;text-transform:uppercase;display:inline-block">
              Shop Again
            </a>
          </div>
        </div>
        <div style="background:#0f0e0d;padding:25px;text-align:center">
          <p style="color:#6a6560;font-size:12px;margin:0">© 2026 MAISON. All rights reserved.</p>
          <p style="color:#6a6560;font-size:12px;margin:8px 0 0">Questions? Email us at ${process.env.EMAIL_USER}</p>
        </div>
      </div>
    `,
  });
  console.log('Delivered email sent to:', userEmail);
};

const sendWelcomeEmail = async (userEmail, userName) => {
  await transporter.sendMail({
    from: `"MAISON Fashion" <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: 'Welcome to MAISON 👗',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
        <div style="background:#0f0e0d;padding:30px;text-align:center">
          <h1 style="font-family:Georgia,serif;color:#f7f4ef;font-weight:300;letter-spacing:0.2em;margin:0;font-size:28px">MAISON</h1>
        </div>
        <div style="padding:40px 30px;background:#ffffff">
          <h2 style="font-family:Georgia,serif;font-weight:300;color:#0f0e0d">Welcome, ${userName}! 🎉</h2>
          <p style="color:#7a7570;font-size:15px;line-height:1.7">Thank you for joining MAISON. Discover our latest collections and enjoy exclusive member benefits.</p>
          <ul style="color:#7a7570;font-size:14px;line-height:2">
            <li>✅ Free shipping on orders above ₹2,999</li>
            <li>✅ Easy 14-day returns</li>
            <li>✅ Exclusive member-only deals</li>
          </ul>
          <div style="text-align:center;margin:30px 0">
            <a href="https://maison-ecommerce-snowy.vercel.app/products" style="background:#b5833a;color:#ffffff;padding:14px 32px;text-decoration:none;font-size:13px;letter-spacing:0.12em;text-transform:uppercase">
              Shop Now
            </a>
          </div>
        </div>
        <div style="background:#0f0e0d;padding:25px;text-align:center">
          <p style="color:#6a6560;font-size:12px;margin:0">© 2026 MAISON. All rights reserved.</p>
        </div>
      </div>
    `,
  });
  console.log('Welcome email sent to:', userEmail);
};

const sendAdminOrderAlert = async (order, userEmail) => {
  await transporter.sendMail({
    from: `"MAISON Fashion" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    subject: `🛍 New Order #${order._id.toString().slice(-8).toUpperCase()} — ₹${order.totalAmount.toLocaleString()}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px">
        <h2 style="color:#0f0e0d">🛍 New Order Received!</h2>
        <p><strong>Order ID:</strong> #${order._id.toString().slice(-8).toUpperCase()}</p>
        <p><strong>Customer:</strong> ${userEmail}</p>
        <p><strong>Amount:</strong> ₹${order.totalAmount.toLocaleString()}</p>
        <p><strong>Payment:</strong> ${order.paymentMethod} ${order.isPaid ? '✅ Paid' : '— COD'}</p>
        <p><strong>Estimated Delivery:</strong> ${getDeliveryDates()}</p>
        <p><strong>Items:</strong></p>
        <ul>${order.items.map(i => `<li>${i.name} × ${i.quantity} — ₹${(i.price * i.quantity).toLocaleString()}</li>`).join('')}</ul>
        <p><strong>Ship to:</strong> ${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.state} — ${order.shippingAddress.pincode}</p>
        <p><strong>Phone:</strong> ${order.shippingAddress.phone}</p>
      </div>
    `,
  });
  console.log('Admin order alert sent');
};

const sendDeliveryOtp = async (order, userEmail, userName, otp) => {
  await transporter.sendMail({
    from: `"MAISON Fashion" <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: `🔐 Delivery OTP for Order #${order._id.toString().slice(-8).toUpperCase()}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f7f4ef">
        <div style="background:#0f0e0d;padding:30px;text-align:center">
          <h1 style="font-family:Georgia,serif;color:#f7f4ef;font-weight:300;letter-spacing:0.2em;margin:0;font-size:28px">MAISON</h1>
        </div>
        <div style="padding:40px 30px;background:#ffffff">
          <div style="text-align:center;margin-bottom:25px">
            <div style="font-size:50px">🚚🔐</div>
            <h2 style="font-family:Georgia,serif;font-weight:300;color:#0f0e0d">Your Delivery OTP</h2>
            <p style="color:#7a7570;font-size:15px;line-height:1.7">Hi ${userName}, your order is out for delivery! Share this OTP with the delivery person to confirm delivery.</p>
          </div>
          <div style="background:#f7f4ef;padding:15px 20px;border-left:3px solid #b5833a;margin:25px 0">
            <p style="margin:0;font-size:13px;color:#7a7570;text-transform:uppercase">Order ID</p>
            <p style="margin:5px 0 0;font-size:18px;font-weight:600;color:#0f0e0d">#${order._id.toString().slice(-8).toUpperCase()}</p>
          </div>
          <div style="background:#fff8f0;border:2px solid #b5833a;padding:30px;margin:25px 0;text-align:center;border-radius:8px">
            <p style="color:#7a7570;font-size:13px;margin:0 0 10px;text-transform:uppercase;letter-spacing:0.1em">Your Delivery OTP</p>
            <p style="color:#0f0e0d;font-size:48px;font-weight:700;margin:0;letter-spacing:0.3em">${otp}</p>
            <p style="color:#7a7570;font-size:12px;margin:10px 0 0">Valid for this delivery only.</p>
          </div>
          <div style="background:#fff3f3;border:1px solid #e74c3c;padding:15px 20px;border-radius:4px">
            <p style="color:#e74c3c;font-size:13px;margin:0">⚠️ Only share this OTP with the MAISON delivery person.</p>
          </div>
        </div>
        <div style="background:#0f0e0d;padding:25px;text-align:center">
          <p style="color:#6a6560;font-size:12px;margin:0">© 2026 MAISON. All rights reserved.</p>
        </div>
      </div>
    `,
  });
  console.log('Delivery OTP email sent to:', userEmail);
};

module.exports = { sendOrderConfirmation, sendOrderDelivered, sendWelcomeEmail, sendAdminOrderAlert, sendDeliveryOtp };