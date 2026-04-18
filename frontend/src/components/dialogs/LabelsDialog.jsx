import { useState } from 'react';
import { useUIStore } from '@/store';
import { Modal, Button, Stack, Label } from '@/components/ui';

const LABEL_PRODUCTS = [
  { value: 'avery-5160', label: 'Avery 5160 - Address Labels (1" x 2.625")' },
  { value: 'avery-5161', label: 'Avery 5161 - Address Labels (1" x 4")' },
  { value: 'avery-5162', label: 'Avery 5162 - Address Labels (1.5" x 4")' },
  { value: 'avery-8160', label: 'Avery 8160 - Mailing Labels (1" x 2.625")' },
  { value: 'avery-8161', label: 'Avery 8161 - Mailing Labels (1" x 4")' },
  { value: 'avery-8162', label: 'Avery 8162 - Mailing Labels (1.5" x 4")' },
  { value: 'avery-8163', label: 'Avery 8163 - Shipping Labels (4" x 6")' },
  { value: 'generic-1x2.5', label: 'Generic - 1" x 2.5" Labels' },
  { value: 'generic-4x6', label: 'Generic - 4" x 6" Shipping Labels' },
];

export function LabelsDialog() {
  const { closeDialog, toast } = useUIStore();

  const [labelName, setLabelName] = useState('');
  const [labelAddress, setLabelAddress] = useState('');
  const [labelCity, setLabelCity] = useState('');
  const [labelState, setLabelState] = useState('');
  const [labelZip, setLabelZip] = useState('');
  const [labelProduct, setLabelProduct] = useState('avery-5160');
  const [labelCount, setLabelCount] = useState('1');
  const [startPosition, setStartPosition] = useState('1');

  const handlePrint = () => {
    if (!labelName.trim() || !labelAddress.trim()) {
      toast('Name and address are required', 'warning');
      return;
    }

    if (parseInt(labelCount) < 1) {
      toast('Label count must be at least 1', 'warning');
      return;
    }

    const labelAddressStr = `${labelName}\n${labelAddress}\n${labelCity}${labelState ? ', ' + labelState : ''} ${labelZip}`;

    // Get label dimensions based on product
    const labelDimensions = {
      'avery-5160': { width: '2.625in', height: '1in', cols: 3, rows: 10 },
      'avery-5161': { width: '4in', height: '1in', cols: 2, rows: 10 },
      'avery-5162': { width: '4in', height: '1.5in', cols: 2, rows: 6 },
      'avery-8160': { width: '2.625in', height: '1in', cols: 3, rows: 10 },
      'avery-8161': { width: '4in', height: '1in', cols: 2, rows: 10 },
      'avery-8162': { width: '4in', height: '1.5in', cols: 2, rows: 6 },
      'avery-8163': { width: '6in', height: '4in', cols: 1, rows: 2 },
      'generic-1x2.5': { width: '2.5in', height: '1in', cols: 3, rows: 10 },
      'generic-4x6': { width: '6in', height: '4in', cols: 1, rows: 2 },
    };

    const dims = labelDimensions[labelProduct];

    let labelsHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Labels</title>
        <style>
          @page {
            margin: 0.5in;
            size: letter;
          }
          body {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
            font-size: 10pt;
          }
          .labels-container {
            display: grid;
            grid-template-columns: repeat(${dims.cols}, ${dims.width});
            gap: 0.1in;
            padding: 0.5in;
          }
          .label {
            width: ${dims.width};
            height: ${dims.height};
            border: 1px solid #ccc;
            padding: 0.1in;
            box-sizing: border-box;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            white-space: pre-line;
            font-size: 9pt;
            line-height: 1.2;
            overflow: hidden;
          }
        </style>
      </head>
      <body>
        <div class="labels-container">
    `;

    // Generate labels
    for (let i = 0; i < parseInt(labelCount); i++) {
      labelsHTML += `<div class="label">${labelAddressStr}</div>`;
    }

    labelsHTML += `
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(labelsHTML);
    printWindow.document.close();
    printWindow.print();

    toast(`${labelCount} label(s) sent to printer`, 'success');
    handleClose();
  };

  const handleClose = () => {
    closeDialog('labels');
  };

  return (
    <Modal isOpen={true} onClose={handleClose} title="Labels">
      <Stack gap={16} style={{ padding: '16px', maxWidth: '500px', maxHeight: '600px', overflowY: 'auto' }}>
        {/* Label Information */}
        <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: 12 }}>
          <h4 style={{ margin: '0 0 12px 0', fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'var(--font-ui)' }}>
            Label Information
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div>
              <Label>Name *</Label>
              <input
                type="text"
                value={labelName}
                onChange={(e) => setLabelName(e.target.value)}
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
                value={labelAddress}
                onChange={(e) => setLabelAddress(e.target.value)}
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <div>
                <Label>City</Label>
                <input
                  type="text"
                  value={labelCity}
                  onChange={(e) => setLabelCity(e.target.value)}
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
                <Label>State</Label>
                <input
                  type="text"
                  value={labelState}
                  onChange={(e) => setLabelState(e.target.value.toUpperCase())}
                  placeholder="ST"
                  maxLength="2"
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
            </div>

            <div>
              <Label>ZIP</Label>
              <input
                type="text"
                value={labelZip}
                onChange={(e) => setLabelZip(e.target.value)}
                placeholder="12345"
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
          </div>
        </div>

        {/* Label Product */}
        <div>
          <Label>Label Product</Label>
          <select
            value={labelProduct}
            onChange={(e) => setLabelProduct(e.target.value)}
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
            {LABEL_PRODUCTS.map((product) => (
              <option key={product.value} value={product.value}>
                {product.label}
              </option>
            ))}
          </select>
        </div>

        {/* Label Count */}
        <div>
          <Label>Number of Labels</Label>
          <input
            type="number"
            value={labelCount}
            onChange={(e) => setLabelCount(e.target.value)}
            min="1"
            max="100"
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
          />
        </div>

        {/* Start Position */}
        <div>
          <Label>Start on Label Position</Label>
          <input
            type="number"
            value={startPosition}
            onChange={(e) => setStartPosition(e.target.value)}
            min="1"
            max="30"
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
          />
          <p style={{ fontSize: 9, color: 'var(--text-muted)', margin: '4px 0 0 0', fontFamily: 'var(--font-ui)' }}>
            Start printing on this position if reusing label sheets
          </p>
        </div>

        {/* Preview */}
        <div>
          <Label>Preview</Label>
          <div
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              padding: 10,
              marginTop: 4,
              fontSize: 9,
              fontFamily: 'var(--font-ui)',
              color: 'var(--text-primary)',
              whiteSpace: 'pre-line',
              textAlign: 'center',
            }}
          >
            {labelName ? `${labelName}\n${labelAddress}\n${labelCity}${labelState ? ', ' + labelState : ''} ${labelZip}` : '(label preview)'}
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 16, borderTop: '1px solid var(--border)', paddingTop: 12 }}>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handlePrint}>
            Print Labels
          </Button>
        </div>
      </Stack>
    </Modal>
  );
}
