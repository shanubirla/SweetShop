import { useRef } from 'react';

const BillGenerator = ({ order, sweets }) => {
  const billRef = useRef();

  const generatePDF = () => {
    const element = billRef.current;
    const opt = {
      margin: 10,
      filename: `bill-${order._id}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
    };

    const html2pdf = window.html2pdf || require('html2pdf.js');
    html2pdf().set(opt).from(element).save();
  };

  const printBill = () => {
    const element = billRef.current;
    const printWindow = window.open('', '', 'height=600,width=800');
    printWindow.document.write(element.innerHTML);
    printWindow.document.close();
    printWindow.print();
  };

  const getItemDetails = (itemId) => {
    return sweets.find(s => s._id === itemId);
  };

  const subtotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discount = order.discountAmount || 0;
  const total = subtotal - discount;

  return (
    <div>
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
        <button
          onClick={printBill}
          className="btn btn-primary"
          style={{ fontSize: '14px', padding: '10px 20px' }}
        >
          Print Bill
        </button>
        <button
          onClick={generatePDF}
          className="btn btn-secondary"
          style={{ fontSize: '14px', padding: '10px 20px' }}
        >
          Download PDF
        </button>
      </div>

      <div
        ref={billRef}
        style={{
          background: 'white',
          padding: '40px',
          borderRadius: '12px',
          maxWidth: '600px',
          margin: '0 auto',
          fontFamily: 'Arial, sans-serif',
          fontSize: '14px',
          lineHeight: '1.6',
          color: '#333'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '30px', borderBottom: '2px solid #A8E6CF', paddingBottom: '20px' }}>
          <h1 style={{ margin: '0 0 5px 0', fontSize: '28px', color: '#A8E6CF', fontWeight: '600' }}>
            ◆ Sweet Heaven
          </h1>
          <p style={{ margin: '5px 0', color: '#999', fontSize: '12px' }}>Premium Artisan Sweets</p>
          <p style={{ margin: '5px 0', color: '#999', fontSize: '12px' }}>Contact: support@sweetheaven.com</p>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', fontSize: '13px' }}>
            <div>
              <p style={{ margin: '0 0 5px 0', fontWeight: '600', color: '#4a4a4a' }}>Bill Number</p>
              <p style={{ margin: '0', color: '#666' }}>{order._id.slice(-8).toUpperCase()}</p>
            </div>
            <div>
              <p style={{ margin: '0 0 5px 0', fontWeight: '600', color: '#4a4a4a' }}>Date</p>
              <p style={{ margin: '0', color: '#666' }}>{new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
            <div>
              <p style={{ margin: '0 0 5px 0', fontWeight: '600', color: '#4a4a4a' }}>Customer Email</p>
              <p style={{ margin: '0', color: '#666' }}>{order.userId}</p>
            </div>
            <div>
              <p style={{ margin: '0 0 5px 0', fontWeight: '600', color: '#4a4a4a' }}>Status</p>
              <p style={{ margin: '0', color: '#A8E6CF', fontWeight: '600' }}>{order.status.toUpperCase()}</p>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '20px', borderTop: '1px solid #eee', borderBottom: '1px solid #eee', paddingTop: '15px', paddingBottom: '15px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '10px', marginBottom: '10px', fontWeight: '600', fontSize: '12px', color: '#4a4a4a' }}>
            <div>Item</div>
            <div style={{ textAlign: 'right' }}>Qty</div>
            <div style={{ textAlign: 'right' }}>Price</div>
            <div style={{ textAlign: 'right' }}>Total</div>
          </div>

          {order.items.map((item, idx) => (
            <div key={idx} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '10px', marginBottom: '8px', fontSize: '13px', borderBottom: '1px solid #f0f0f0', paddingBottom: '8px' }}>
              <div>{item.name}</div>
              <div style={{ textAlign: 'right' }}>{item.quantity}</div>
              <div style={{ textAlign: 'right' }}>₹{item.price.toFixed(2)}</div>
              <div style={{ textAlign: 'right', fontWeight: '600' }}>₹{(item.price * item.quantity).toFixed(2)}</div>
            </div>
          ))}
        </div>

        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '8px', fontSize: '13px' }}>
            <div style={{ width: '200px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>Subtotal:</div>
              <div style={{ textAlign: 'right' }}>₹{subtotal.toFixed(2)}</div>
            </div>
          </div>

          {discount > 0 && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '8px', fontSize: '13px', color: '#27AE60' }}>
              <div style={{ width: '200px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>Discount:</div>
                <div style={{ textAlign: 'right' }}>-₹{discount.toFixed(2)}</div>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', fontSize: '16px', fontWeight: '600', color: '#A8E6CF', borderTop: '2px solid #A8E6CF', paddingTop: '10px' }}>
            <div style={{ width: '200px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>Total Amount:</div>
              <div style={{ textAlign: 'right' }}>₹{total.toFixed(2)}</div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #eee', textAlign: 'center', fontSize: '12px', color: '#999' }}>
          <p style={{ margin: '0 0 5px 0' }}>Delivery Address: {order.deliveryAddress}</p>
          <p style={{ margin: '0 0 10px 0' }}>Thank you for your purchase!</p>
          <p style={{ margin: '0', fontSize: '11px' }}>This is a computer-generated bill. No signature required.</p>
        </div>
      </div>
    </div>
  );
};

export default BillGenerator;
