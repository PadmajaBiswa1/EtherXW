import { useState } from 'react';
import { useUIStore, useEditorStore } from '@/store';
import { Button, Input, Tooltip, Modal } from '@/components/ui';

export function InsertEquationDialog() {
  const { closeDialog } = useUIStore();
  const { editor } = useEditorStore();
  const [equationText, setEquationText] = useState('');

  const EQUATIONS = [
    { formula: 'a² + b² = c²', label: 'Pythagorean Theorem' },
    { formula: 'e = mc²', label: 'Mass-Energy Equivalence' },
    { formula: 'E = ½mv²', label: 'Kinetic Energy' },
    { formula: 'F = ma', label: 'Newton\'s Second Law' },
    { formula: '∫ f(x)dx', label: 'Integration' },
    { formula: '∑ᵢ₌₁ⁿ aᵢ', label: 'Summation' },
    { formula: 'P(A|B) = P(B|A)P(A)/P(B)', label: 'Bayes\' Theorem' },
    { formula: 'nCr = n!/(r!(n-r)!)', label: 'Combinations' },
  ];

  const insertEquation = (formula) => {
    const eqHtml = `<div style="padding: 12px; background: var(--bg-elevated); border: 1px solid var(--border-gold); border-radius: var(--radius-md); margin: 12px 0; font-family: 'Cambria Math', serif; font-size: 16px; color: var(--text-primary); text-align: center;" data-equation="true">${formula}</div>`;
    editor?.chain().insertContent(eqHtml).run();
    closeDialog('equation');
  };

  const handleCustom = () => {
    if (equationText.trim()) {
      insertEquation(equationText);
    }
  };

  return (
    <Modal title="Insert Equation" onClose={() => closeDialog('equation')}>
      <div style={{ minWidth: 420, maxHeight: '70vh', overflow: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 8, color: 'var(--text-muted)' }}>BUILT-IN EQUATIONS</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {EQUATIONS.map((eq, i) => (
              <button
                key={i}
                onClick={() => insertEquation(eq.formula)}
                style={{
                  padding: 12, background: 'var(--bg-surface)', border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)', cursor: 'pointer', transition: 'all 0.1s', textAlign: 'left'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.background = 'var(--bg-elevated)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg-surface)'; }}
              >
                <Tooltip text={eq.label}>
                  <div style={{ fontFamily: 'Cambria Math, serif', fontSize: 14, color: 'var(--text-primary)', marginBottom: 4 }}>
                    {eq.formula}
                  </div>
                </Tooltip>
                <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: 0 }}>{eq.label}</p>
              </button>
            ))}
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8, color: 'var(--text-primary)' }}>
            Or enter custom equation
          </label>
          <div style={{ display: 'flex', gap: 8 }}>
            <Input
              value={equationText}
              onChange={(e) => setEquationText(e.target.value)}
              placeholder="e.g., x = (-b ± √(b²-4ac)) / 2a"
            />
            <Button variant="primary" onClick={handleCustom} disabled={!equationText.trim()}>Add</Button>
          </div>
        </div>

        {equationText && (
          <div style={{
            padding: 12, background: 'var(--bg-elevated)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)', fontFamily: 'Cambria Math, serif', fontSize: 14,
            color: 'var(--text-primary)', textAlign: 'center'
          }}>
            {equationText}
          </div>
        )}

        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <Button variant="secondary" onClick={() => closeDialog('equation')}>Cancel</Button>
        </div>
      </div>
    </Modal>
  );
}
