import { useState, useRef } from 'react';
import { useUIStore } from '@/store';
import { Modal, Button, Stack, Label } from '@/components/ui';

const ENVELOPE_SIZES = [
  { value: 'standard-10', label: 'Standard (#10) 4.125" x 9.5"' },
  { value: 'standard-9', label: 'Standard (#9) 3.875" x 8.875"' },
  { value: 'standard-11', label: 'Standard (#11) 4.5" x 10.375"' },
  { value: 'standard-12', label: 'Standard (#12) 4.75" x 11"' },
  { value: 'standard-14', label: 'Standard (#14) 5" x 11.5"' },
  { value: 'international-c6', label: 'International (C6) 114mm x 162mm' },
  { value: 'international-c5', label: 'International (C5) 162mm x 229mm' },
  { value: 'international-dl', label: 'International (DL) 110mm x 220mm' },
];

export function EnvelopeDialog() {
  const { closeDialog, toast } = useUIStore();

  const [returnName, setReturnName] = useState('');
  const [returnAddress, setReturnAddress] = useState('');
  const [returnCity, setReturnCity] = useState('');
  const [returnState, setReturnState] = useState('');
  const [returnZip, setReturnZip] = useState('');

  const [deliveryName, setDeliveryName] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryCity, setDeliveryCity] = useState('');
  const [deliveryState, setDeliveryState] = useState('');
  const [deliveryZip, setDeliveryZip] = useState('');

  const [envelopeSize, setEnvelopeSize] = useState('standard-10');
  const [printSample, setPrintSample] = useState(false);

  const handlePrint = () => {
    if (!deliveryName.trim() || !deliveryAddress.trim()) {
      toast('Delivery address is required', 'warning');
      return;
    }

    // Create printable envelope HTML
    const deliveryAddressStr = `${deliveryName}\n${deliveryAddress}\n${deliveryCity}, ${deliveryState} ${deliveryZip}`;
    const returnAddressStr = returnName ? `${returnName}\n${returnAddress}\n${returnCity}, ${returnState} ${returnZip}` : '';

    const envelopeHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Envelope</title>
        <style>
          @page {
            margin: 0;
            size: ${envelopeSize.includes('standard') ? '4.125in 9.5in' : '114mm 162mm'};
          }
          body {
            margin: 0;
            padding: 0.5in;
            font-family: Arial, sans-serif;
            font-size: 11pt;
          }
          .return-address {
            font-size: 8pt;
            margin-bottom: 0.5in;
            white-space: pre-line;
          }
          .delivery-address {
            margin-top: 1.5in;
            margin-left: 3.5in;
            white-space: pre-line;
            font-size: 12pt;
          }
        </style>
      </head>
      <body>
        ${returnAddressStr ? `<div class="return-address">${returnAddressStr}</div>` : ''}
        <div class="delivery-address">${deliveryAddressStr}</div>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(envelopeHTML);
    printWindow.document.close();
    printWindow.print();

    toast('Envelope sent to printer', 'success');
    handleClose();
  };

  const handleClose = () => {
    closeDialog('envelope');
  };

  return (
    <Modal isOpen={true} onClose={handleClose} title="Envelopes">
      <Stack gap={16} style={{ padding: '16px', maxWidth: '600px', maxHeight: '600px', overflowY: 'auto' }}>
        {/* Return Address Section */}
        <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: 12 }}>
          <h4 style={{ margin: '0 0 12px 0', fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'var(--font-ui)' }}>
            Return Address (Optional)
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <Label>Name</Label>
              <input
                type="text"
                value={returnName}
                onChange={(e) => setReturnName(e.target.value)}
                placeholder="Your name"
                style={{
                  width: '100%',
                  padding: '6px 8px',
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-primary)',
                  fontSize: 10,
                  fontFamily: 'var(--font-ui)',
                  marginTop: 4,
                  boxSizing: 'border-box',
                }}
              />
            </div>
            <div>
              <Label>Address</Label>
              <input
                type="text"
                value={returnAddress}
                onChange={(e) => setReturnAddress(e.target.value)}
                placeholder="Street address"
                style={{
                  width: '100%',
                  padding: '6px 8px',
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-primary)',
                  fontSize: 10,
                  fontFamily: 'var(--font-ui)',
                  marginTop: 4,
                  boxSizing: 'border-box',
                }}
              />
            </div>
            <div>
              <Label>City</Label>
              <input
                type="text"
                value={returnCity}
                onChange={(e) => setReturnCity(e.target.value)}
                placeholder="City"
                style={{
                  width: '100%',
                  padding: '6px 8px',
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-primary)',
                  fontSize: 10,
                  fontFamily: 'var(--font-ui)',
                  marginTop: 4,
                  boxSizing: 'border-box',
                }}
              />
            </div>
            <div>
              <Label>State/ZIP</Label>
              <div style={{ display: 'flex', gap: 6 }}>
                <input
                  type="text"
                  value={returnState}
                  onChange={(e) => setReturnState(e.target.value.toUpperCase())}
                  placeholder="ST"
                  maxLength="2"
                  style={{
                    width: '40px',
                    padding: '6px 8px',
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--text-primary)',
                    fontSize: 10,
                    fontFamily: 'var(--font-ui)',
                    marginTop: 4,
                    boxSizing: 'border-box',
                  }}
                />
                <input
                  type="text"
                  value={returnZip}
                  onChange={(e) => setReturnZip(e.target.value)}
                  placeholder="12345"
                  style={{
                    flex: 1,
                    padding: '6px 8px',
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--text-primary)',
                    fontSize: 10,
                    fontFamily: 'var(--font-ui)',
                    marginTop: 4,
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Address Section */}
        <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: 12 }}>
          <h4 style={{ margin: '0 0 12px 0', fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'var(--font-ui)' }}>
            Delivery Address *
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <Label>Name *</Label>
              <input
                type="text"
                value={deliveryName}
                onChange={(e) => setDeliveryName(e.target.value)}
                placeholder="Recipient name"
                style={{
                  width: '100%',
                  padding: '6px 8px',
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-primary)',
                  fontSize: 10,
                  fontFamily: 'var(--font-ui)',
                  marginTop: 4,
                  boxSizing: 'border-box',
                }}
              />
            </div>
            <div>
              <Label>Address *</Label>
              <input
                type="text"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder="Street address"
                style={{
                  width: '100%',
                  padding: '6px 8px',
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-primary)',
                  fontSize: 10,
                  fontFamily: 'var(--font-ui)',
                  marginTop: 4,
                  boxSizing: 'border-box',
                }}
              />
            </div>
            <div>
              <Label>City</Label>
              <input
                type="text"
                value={deliveryCity}
                onChange={(e) => setDeliveryCity(e.target.value)}
                placeholder="City"
                style={{
                  width: '100%',
                  padding: '6px 8px',
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-primary)',
                  fontSize: 10,
                  fontFamily: 'var(--font-ui)',
                  marginTop: 4,
                  boxSizing: 'border-box',
                }}
              />
            </div>
            <div>
              <Label>State/ZIP</Label>
              <div style={{ display: 'flex', gap: 6 }}>
                <input
                  type="text"
                  value={deliveryState}
                  onChange={(e) => setDeliveryState(e.target.value.toUpperCase())}
                  placeholder="ST"
                  maxLength="2"
                  style={{
                    width: '40px',
                    padding: '6px 8px',
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--text-primary)',
                    fontSize: 10,
                    fontFamily: 'var(--font-ui)',
                    marginTop: 4,
                    boxSizing: 'border-box',
                  }}
                />
                <input
                  type="text"
                  value={deliveryZip}
                  onChange={(e) => setDeliveryZip(e.target.value)}
                  placeholder="12345"
                  style={{
                    flex: 1,
                    padding: '6px 8px',
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--text-primary)',
                    fontSize: 10,
                    fontFamily: 'var(--font-ui)',
                    marginTop: 4,
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Envelope Size */}
        <div>
          <Label>Envelope Size</Label>
          <select
            value={envelopeSize}
            onChange={(e) => setEnvelopeSize(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 10px',
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-primary)',
              fontSize: 10,
              fontFamily: 'var(--font-ui)',
              marginTop: 4,
              boxSizing: 'border-box',
            }}
          >
            {ENVELOPE_SIZES.map((size) => (
              <option key={size.value} value={size.value}>
                {size.label}
              </option>
            ))}
          </select>
        </div>

        {/* Print Sample Checkbox */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input
            type="checkbox"
            id="printSample"
            checked={printSample}
            onChange={(e) => setPrintSample(e.target.checked)}
            style={{ cursor: 'pointer' }}
          />
          <label htmlFor="printSample" style={{ fontSize: 10, fontFamily: 'var(--font-ui)', cursor: 'pointer' }}>
            Print sample envelope
          </label>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 16, borderTop: '1px solid var(--border)', paddingTop: 12 }}>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handlePrint}>
            Print Envelope
          </Button>
        </div>
      </Stack>
    </Modal>
  );
}
