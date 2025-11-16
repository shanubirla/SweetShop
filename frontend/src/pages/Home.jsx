import { Link } from 'react-router-dom';

const Home = () => {
  const categories = [
    { name: 'Gulab Jamun', color: '#FFE5F0' },
    { name: 'Rasgulla', color: '#E5F5F0' },
    { name: 'Jalebi', color: '#FFF9E5' },
    { name: 'Barfi', color: '#F0E5FF' },
    { name: 'Laddu', color: '#FFE5F0' },
  ];

  return (
    <div style={{ background: 'linear-gradient(135deg, #FFF9F5 0%, #F5FFFE 100%)', minHeight: '100vh' }}>
      {/* Hero Section */}
      <section style={{
        minHeight: '600px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        paddingTop: '80px',
        paddingBottom: '60px'
      }}>
        <div style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: '30%',
          height: '100%',
          background: 'radial-gradient(circle at 20% 50%, rgba(255, 182, 193, 0.2), transparent)',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute',
          right: 0,
          top: 0,
          width: '30%',
          height: '100%',
          background: 'radial-gradient(circle at 80% 50%, rgba(176, 224, 230, 0.2), transparent)',
          pointerEvents: 'none'
        }} />

        <div style={{ textAlign: 'center', zIndex: 1, maxWidth: '600px', padding: '40px 20px', marginBottom: '40px' }}>
          <h1 style={{
            fontSize: '56px',
            fontWeight: '700',
            color: '#2c2c2c',
            marginBottom: '20px',
            letterSpacing: '-1px'
          }}>
            Artisan Treats for Joyful Moments
          </h1>
          <p style={{
            fontSize: '18px',
            color: '#2c2c2c',
            marginBottom: '40px',
            fontWeight: '600'
          }}>
            Handcrafted sweets made with love and premium ingredients
          </p>
          <Link to="/dashboard" className="btn btn-primary" style={{
            background: 'linear-gradient(135deg, #A8E6CF 0%, #7FE5D9 100%)',
            color: 'white',
            fontSize: '16px',
            padding: '14px 40px',
            borderRadius: '50px',
            fontWeight: '700',
            display: 'inline-block',
            textDecoration: 'none',
            boxShadow: '0 8px 24px rgba(168, 230, 207, 0.3)'
          }}>
            Shop Now
          </Link>
        </div>

        <div style={{
          fontSize: '48px',
          animation: 'bounce 2s infinite',
          color: '#A8E6CF',
          fontWeight: '300',
          letterSpacing: '2px',
          zIndex: 1
        }}>
          ◆
        </div>
      </section>

      {/* Category Grid */}
      <section style={{ padding: '80px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{
          fontSize: '42px',
          fontWeight: '700',
          color: '#2c2c2c',
          textAlign: 'center',
          marginBottom: '60px'
        }}>
          Our Collections
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '24px'
        }}>
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to="/dashboard"
              style={{
                textDecoration: 'none',
                cursor: 'pointer'
              }}
            >
              <div style={{
                background: cat.color,
                borderRadius: '20px',
                padding: '40px 20px',
                textAlign: 'center',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                border: '2px solid #A8E6CF',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 12px 32px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.1)';
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px', color: '#A8E6CF', fontWeight: '300', letterSpacing: '2px' }}>
                  ◆
                </div>
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: '700',
                  color: '#2c2c2c',
                  margin: 0
                }}>
                  {cat.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section style={{
        padding: '80px 20px',
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '60px',
        alignItems: 'center'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #FFE5F0 0%, #E5F5F0 100%)',
          borderRadius: '20px',
          height: '400px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '48px',
          color: '#A8E6CF',
          fontWeight: '300',
          letterSpacing: '2px',
          border: '2px solid #A8E6CF'
        }}>
          ◆
        </div>

        <div>
          <h2 style={{
            fontSize: '42px',
            fontWeight: '700',
            color: '#2c2c2c',
            marginBottom: '20px'
          }}>
            Our Story
          </h2>
          <p style={{
            fontSize: '16px',
            color: '#2c2c2c',
            lineHeight: '1.8',
            marginBottom: '16px',
            fontWeight: '600'
          }}>
            Sweet Heaven was founded with a passion for creating artisan treats that bring joy to every moment. Each sweet is carefully crafted using premium ingredients and traditional recipes passed down through generations.
          </p>
          <p style={{
            fontSize: '16px',
            color: '#2c2c2c',
            lineHeight: '1.8',
            fontWeight: '600'
          }}>
            We believe in quality over quantity, sustainability, and making every customer feel special. Visit us today and experience the magic of handmade sweets!
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        padding: '80px 20px',
        textAlign: 'center',
        background: 'linear-gradient(135deg, #A8E6CF 0%, #7FE5D9 100%)',
        margin: '60px 20px',
        borderRadius: '20px',
        maxWidth: '1200px',
        marginLeft: 'auto',
        marginRight: 'auto'
      }}>
        <h2 style={{
          fontSize: '42px',
          fontWeight: '700',
          color: 'white',
          marginBottom: '20px'
        }}>
          Ready to Indulge?
        </h2>
        <p style={{
          fontSize: '18px',
          color: 'white',
          marginBottom: '30px',
          fontWeight: '600'
        }}>
          Explore our full collection of delicious treats
        </p>
        <Link to="/dashboard" className="btn btn-primary" style={{
          background: 'white',
          color: '#A8E6CF',
          fontSize: '16px',
          padding: '14px 40px',
          borderRadius: '50px',
          fontWeight: '700',
          display: 'inline-block',
          textDecoration: 'none',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)'
        }}>
          Browse Collection
        </Link>
      </section>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  );
};

export default Home;
