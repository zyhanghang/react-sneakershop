export const formatPrice = cents => {
  return (cents/100).toLocaleString('us', {
    style: 'currency',
    currency: 'USD'
  });
};