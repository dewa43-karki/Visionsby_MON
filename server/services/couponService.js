/**
 * Simple Server-Side Coupon Validation
 */
const COUPONS = {
  'WELCOME10': { type: 'percent', value: 10, minOrder: 0, description: '10% Off First Purchase' },
  'MON200': { type: 'flat', value: 200, minOrder: 1500, description: '₹200 Off on orders above ₹1500' },
  'LUXURY500': { type: 'flat', value: 500, minOrder: 3000, description: '₹500 Off on orders above ₹3000' }
};

function validateCouponCode(code, subtotal) {
  if (!code || typeof code !== 'string') {
    return { valid: false, discountAmount: 0, reason: 'Coupon code required' };
  }

  const cleanCode = code.trim().toUpperCase();
  const coupon = COUPONS[cleanCode];

  if (!coupon) {
    return { valid: false, discountAmount: 0, reason: 'Invalid coupon code' };
  }

  if (subtotal < coupon.minOrder) {
    return {
      valid: false,
      discountAmount: 0,
      reason: `Coupon ${cleanCode} requires a minimum order of ₹${coupon.minOrder}`
    };
  }

  let discountAmount = 0;
  if (coupon.type === 'percent') {
    discountAmount = Math.round((subtotal * coupon.value) / 100);
  } else if (coupon.type === 'flat') {
    discountAmount = coupon.value;
  }

  discountAmount = Math.min(discountAmount, subtotal);

  return {
    valid: true,
    code: cleanCode,
    discountAmount,
    description: coupon.description
  };
}

module.exports = {
  COUPONS,
  validateCouponCode
};
