import { useEffect, useState } from 'react';
import { fetchApi } from '../../lib/api';
import { ShoppingCart, CreditCard, Banknote, X, Plus, Minus, Trash2 } from 'lucide-react';

export default function ShopHome() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [ordering, setOrdering] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Online'>('Online');
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // Maps productId to an object containing product info and quantity
  const [cart, setCart] = useState<Record<number, { product: any, quantity: number }>>({});

  const getProductImage = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('milk') && !lowerName.includes('buttermilk')) return 'https://t4.ftcdn.net/jpg/02/31/84/29/360_F_231842968_qThCnmslPbEAwhg7nuW9rAy8qRNhRli7.jpg';
    if (lowerName.includes('curd') || lowerName.includes('yogurt')) return 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=300&fit=crop';
    if (lowerName.includes('paneer') || lowerName.includes('cheese')) return 'https://t4.ftcdn.net/jpg/06/32/64/95/360_F_632649552_4Gi6jOlnbDllG1qyjKo53lzdFDJNDfhq.jpg';
    if (lowerName.includes('ghee') || lowerName.includes('butter') && !lowerName.includes('buttermilk')) return 'https://t4.ftcdn.net/jpg/13/15/19/43/360_F_1315194377_Ro8c5tjMXYc3oEXUJ6zgyeIENDkdQyJX.jpg';
    if (lowerName.includes('buttermilk') || lowerName.includes('chaas')) return 'https://static.wixstatic.com/media/c9e553_d9789d8ab4454cf2b2e7e1fa0b00c741~mv2.jpg/v1/fill/w_560,h_562,al_c,lg_1,q_80,enc_avif,quality_auto/c9e553_d9789d8ab4454cf2b2e7e1fa0b00c741~mv2.jpg';
    return `https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=400&h=300&fit=crop`; // Default dairy-like image
  };

  const getProductBadge = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('milk') || lowerName.includes('buttermilk')) return { label: '#FreshDaily', color: '#22c55e' };
    if (lowerName.includes('curd') || lowerName.includes('yogurt')) return { label: '#FarmFresh', color: '#22c55e' };
    if (lowerName.includes('ghee')) return { label: '#PremiumQuality', color: '#22c55e' };
    if (lowerName.includes('paneer')) return { label: '#BestQuality', color: '#22c55e' };
    return null;
  };

  useEffect(() => {
    fetchApi('/products')
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const updateQuantity = (product: any, delta: number) => {
    setCart(prev => {
      const currentQty = prev[product.id]?.quantity || 0;
      const newQty = Math.max(0, currentQty + delta);
      
      const newCart = { ...prev };
      if (newQty === 0) {
        delete newCart[product.id];
      } else {
        newCart[product.id] = { product, quantity: newQty };
      }
      return newCart;
    });
  };

  const removeFromCart = (productId: number) => {
    setCart(prev => {
      const newCart = { ...prev };
      delete newCart[productId];
      return newCart;
    });
  };

  const handleCheckoutClick = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to place an order.');
      window.location.href = '/shop/login';
      return;
    }
    setIsCartOpen(true);
  };

  const handlePlaceOrder = async () => {
    const cartItems = Object.values(cart) as Array<{product: any, quantity: number}>;
    if (cartItems.length === 0) return;
    
    setOrdering(true);
    try {
      await fetchApi('/orders', {
        method: 'POST',
        body: JSON.stringify({
          items: cartItems.map(item => ({
            productId: item.product.id,
            quantity: item.quantity,
            price: item.product.price
          })),
          paymentMethod: paymentMethod
        })
      });
      alert('Order placed successfully!');
      setCart({});
      setIsCartOpen(false);
    } catch (err: any) {
      alert(err.message || 'Failed to place order. Check inventory stock.');
    } finally {
      setOrdering(false);
    }
  };

  const cartValues = Object.values(cart) as Array<{product: any, quantity: number}>;
  const cartItemsCount = cartValues.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartValues.reduce((sum, item) => sum + (item.quantity * item.product.price), 0);

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '48px', fontFamily: "'DM Sans', sans-serif", color: '#666' }}>
      Loading products...
    </div>
  );

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: '#f5f0e8', minHeight: '100vh', paddingBottom: '96px' }}>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,700;1,700&display=swap');

        .product-card {
          background: #fff;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
          position: relative;
        }
        .product-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 28px rgba(0,0,0,0.12);
        }
        .product-img {
          width: 100%;
          height: 220px;
          object-fit: cover;
          display: block;
          transition: transform 0.4s ease;
        }
        .product-card:hover .product-img {
          transform: scale(1.04);
        }
        .add-to-cart-btn {
          width: 100%;
          background: #1a9e4a;
          color: #fff;
          border: none;
          border-radius: 12px;
          padding: 14px 0;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-family: 'DM Sans', sans-serif;
          transition: background 0.2s ease, transform 0.15s ease;
        }
        .add-to-cart-btn:hover {
          background: #158a3d;
          transform: translateY(-1px);
        }
        .qty-control {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #f0faf4;
          border: 2px solid #1a9e4a;
          border-radius: 12px;
          padding: 6px 10px;
        }
        .qty-btn {
          background: #1a9e4a;
          color: #fff;
          border: none;
          border-radius: 8px;
          width: 34px;
          height: 34px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.2s;
        }
        .qty-btn:hover { background: #158a3d; }
        .badge {
          position: absolute;
          top: 14px;
          left: 14px;
          background: #1a9e4a;
          color: #fff;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.08em;
          padding: 4px 10px;
          border-radius: 6px;
          z-index: 2;
        }
        .price-tag {
          background: #f0faf4;
          color: #1a9e4a;
          font-weight: 700;
          font-size: 15px;
          padding: 5px 12px;
          border-radius: 8px;
        }
        .confirm-btn {
          width: 100%;
          background: #1a9e4a;
          color: #fff;
          border: none;
          border-radius: 12px;
          padding: 16px;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: background 0.2s;
        }
        .confirm-btn:hover:not(:disabled) { background: #158a3d; }
        .confirm-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .checkout-bar {
          width: 100%;
          max-width: 480px;
          background: #1a9e4a;
          color: #fff;
          border: none;
          border-radius: 50px;
          padding: 16px 28px;
          font-size: 17px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-family: 'DM Sans', sans-serif;
          box-shadow: 0 8px 24px rgba(26,158,74,0.35);
          transition: background 0.2s, transform 0.15s;
        }
        .checkout-bar:hover { background: #158a3d; transform: translateY(-2px); }
        .payment-option {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 16px;
          border-radius: 14px;
          border: 2px solid #e5e7eb;
          cursor: pointer;
          transition: all 0.2s;
          background: #fff;
          gap: 8px;
        }
        .payment-option.selected {
          border-color: #1a9e4a;
          background: #f0faf4;
          color: #1a9e4a;
        }
        .payment-option:hover { border-color: #1a9e4a; }
      `}</style>

      {/* Hero Section */}
      <div style={{ position: 'relative', height: '480px', overflow: 'hidden' }}>
        <img
          src="https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=1600&h=600&fit=crop"
          alt="Farm"
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          referrerPolicy="no-referrer"
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.55) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 24px' }}>
          {/* Badge pill */}
          <div style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.4)', backdropFilter: 'blur(8px)', borderRadius: '50px', padding: '6px 18px', color: '#fff', fontSize: '13px', fontWeight: 600, letterSpacing: '0.06em', marginBottom: '22px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            🌿 100% NATURAL · A2 CERTIFIED
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(40px, 7vw, 68px)', color: '#fff', margin: '0 0 10px', lineHeight: 1.1, fontWeight: 700 }}>
            Farm to Your
          </h1>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(40px, 7vw, 68px)', color: '#6ee898', margin: '0 0 18px', lineHeight: 1.1, fontWeight: 700, fontStyle: 'italic' }}>
            Doorstep
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '17px', maxWidth: '520px', lineHeight: 1.6, marginBottom: '28px' }}>
            Handpicked dairy from our family farm — pure, fresh, and delivered every morning.
          </p>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {['The true taste of dairy', 'Same-Day Dispatch', 'No Preservatives'].map(tag => (
              <span key={tag} style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.3)', backdropFilter: 'blur(6px)', borderRadius: '50px', padding: '7px 16px', color: '#fff', fontSize: '13px', fontWeight: 500 }}>
                {tag}
              </span>
            ))}
          </div>
        </div>

      </div>

      {/* Stats bar — full-width white section below hero */}
      <div style={{ background: '#fff', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1px 1fr 1px 1fr' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', gap: '10px' }}>
            <span style={{ fontSize: '40px', lineHeight: 1 }}>⭐</span>
            <div style={{ fontWeight: 800, fontSize: '20px', color: '#111' }}>4.9 Rating</div>
            <div style={{ fontSize: '14px', color: '#999' }}>2,400+ Reviews</div>
          </div>
          <div style={{ background: '#eee', margin: '32px 0' }} />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', gap: '10px' }}>
            <span style={{ fontSize: '40px', lineHeight: 1 }}>🚚</span>
            <div style={{ fontWeight: 800, fontSize: '20px', color: '#111' }}>Free Delivery</div>
            <div style={{ fontSize: '14px', color: '#999' }}>On orders ₹200+</div>
          </div>
          <div style={{ background: '#eee', margin: '32px 0' }} />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', gap: '10px' }}>
            <span style={{ fontSize: '40px', lineHeight: 1 }}>🌿</span>
            <div style={{ fontWeight: 800, fontSize: '20px', color: '#111' }}>Organic</div>
            <div style={{ fontSize: '14px', color: '#999' }}>No additives</div>
          </div>
        </div>
      </div>

      {/* Products section */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '56px 24px 0' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ display: 'inline-block', background: '#f0faf4', border: '1px solid #c3edd2', borderRadius: '50px', padding: '6px 18px', fontSize: '13px', fontWeight: 600, color: '#1a9e4a', letterSpacing: '0.06em', marginBottom: '14px' }}>
            OUR PRODUCTS
          </div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(28px, 4vw, 42px)', color: '#1a1a1a', margin: '0 0 10px', fontWeight: 700 }}>
            Fresh from the Farm
          </h2>
          <p style={{ color: '#888', fontSize: '16px', margin: 0 }}>Collected every morning, delivered straight to your home.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '28px' }}>
          {products.map(p => {
            const qty = cart[p.id]?.quantity || 0;
            const badge = getProductBadge(p.name);
            return (
              <div key={p.id} className="product-card">
                <div style={{ position: 'relative', overflow: 'hidden' }}>
                  {badge && (
                    <span className="badge">{badge.label}</span>
                  )}
                  <img
                    src={getProductImage(p.name)}
                    alt={p.name}
                    className="product-img"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '22px', fontWeight: 700, color: '#1a1a1a', margin: 0 }}>{p.name}</h3>
                    <span className="price-tag">₹{p.price}</span>
                  </div>
                  <p style={{ color: '#22a354', fontSize: '13px', fontWeight: 500, margin: '0 0 18px' }}>{p.description}</p>

                  {qty === 0 ? (
                    <button className="add-to-cart-btn" onClick={() => updateQuantity(p, 1)}>
                      <ShoppingCart size={18} />
                      Add to Cart
                    </button>
                  ) : (
                    <div className="qty-control">
                      <button className="qty-btn" onClick={() => updateQuantity(p, -1)}>
                        <Minus size={16} />
                      </button>
                      <span style={{ fontWeight: 700, fontSize: '18px', color: '#1a1a1a', minWidth: '32px', textAlign: 'center' }}>{qty}</span>
                      <button className="qty-btn" onClick={() => updateQuantity(p, 1)}>
                        <Plus size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Cart Button */}
      {cartItemsCount > 0 && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: '16px 24px 28px', background: 'linear-gradient(to top, #f5f0e8 60%, transparent)', zIndex: 40, display: 'flex', justifyContent: 'center', pointerEvents: 'none' }}>
          <button className="checkout-bar" style={{ pointerEvents: 'auto' }} onClick={handleCheckoutClick}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ position: 'relative' }}>
                <ShoppingCart size={22} />
                <span style={{ position: 'absolute', top: '-10px', right: '-10px', background: '#ff4444', color: '#fff', fontSize: '11px', fontWeight: 700, width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', border: '2px solid #1a9e4a' }}>{cartItemsCount}</span>
              </div>
              <span>Checkout</span>
            </div>
            <span>₹{cartTotal.toFixed(2)}</span>
          </button>
        </div>
      )}

      {/* Cart Modal */}
      {isCartOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)', padding: '16px' }}>
          <div style={{ background: '#fff', borderRadius: '24px', width: '100%', maxWidth: '460px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 24px 60px rgba(0,0,0,0.2)' }}>
            {/* Modal header */}
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fafafa' }}>
              <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#1a1a1a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShoppingCart size={20} color="#1a9e4a" /> My Cart
              </h3>
              <button onClick={() => setIsCartOpen(false)} style={{ background: '#f0f0f0', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <X size={18} color="#555" />
              </button>
            </div>

            <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1 }}>
              {cartValues.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '32px 0', color: '#999' }}>Your cart is empty</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {cartValues.map(item => (
                    <div key={item.product.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', borderRadius: '14px', border: '1px solid #f0f0f0', background: '#fafafa' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: '15px', color: '#1a1a1a' }}>{item.product.name}</div>
                        <div style={{ fontSize: '13px', color: '#888' }}>₹{item.product.price} / unit</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '4px 8px' }}>
                          <button onClick={() => updateQuantity(item.product, -1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666', display: 'flex', alignItems: 'center' }}><Minus size={13} /></button>
                          <span style={{ fontWeight: 700, fontSize: '14px', minWidth: '16px', textAlign: 'center' }}>{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.product, 1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1a9e4a', display: 'flex', alignItems: 'center' }}><Plus size={13} /></button>
                        </div>
                        <span style={{ fontWeight: 700, fontSize: '15px', color: '#1a1a1a', minWidth: '52px', textAlign: 'right' }}>₹{item.quantity * item.product.price}</span>
                        <button onClick={() => removeFromCart(item.product.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ccc', display: 'flex', alignItems: 'center', padding: '4px' }}>
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Payment method */}
              <div style={{ marginTop: '28px' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#aaa', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '12px' }}>Select Payment Method</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Online')}
                    className={`payment-option${paymentMethod === 'Online' ? ' selected' : ''}`}
                  >
                    <CreditCard size={28} color={paymentMethod === 'Online' ? '#1a9e4a' : '#aaa'} />
                    <span style={{ fontWeight: 600, fontSize: '14px' }}>Pay Online</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Cash')}
                    className={`payment-option${paymentMethod === 'Cash' ? ' selected' : ''}`}
                  >
                    <Banknote size={28} color={paymentMethod === 'Cash' ? '#1a9e4a' : '#aaa'} />
                    <span style={{ fontWeight: 600, fontSize: '14px' }}>Cash on Delivery</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div style={{ padding: '20px 24px', borderTop: '1px solid #f0f0f0', background: '#fafafa' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span style={{ color: '#888', fontWeight: 500 }}>Total Amount To Pay</span>
                <span style={{ fontSize: '26px', fontWeight: 800, color: '#1a9e4a' }}>₹{cartTotal.toFixed(2)}</span>
              </div>
              <button
                className="confirm-btn"
                onClick={handlePlaceOrder}
                disabled={ordering || cartItemsCount === 0}
              >
                {ordering ? 'Processing Order...' : 'Confirm Order'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}