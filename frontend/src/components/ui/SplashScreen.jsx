import { useState } from 'react';
import { EtherXLogo } from './EtherXLogo';

export function SplashScreen({ title = 'EtherxWord', logoSrc = '/assets/etherxword-logo.png' }) {
  const [hasImageError, setHasImageError] = useState(false);

  return (
    <div className="splash-screen" role="status" aria-live="polite" aria-label="Loading EtherxWord">
      <div className="splash-content anim-fade-in">
        <div className="splash-logo-wrap">
          {!hasImageError ? (
            <img
              src={logoSrc}
              alt="EtherxWord logo"
              className="splash-logo-image"
              onError={() => setHasImageError(true)}
            />
          ) : (
            <div className="splash-logo-fallback">
              <EtherXLogo size={180} />
            </div>
          )}
        </div>
        <h1 className="splash-title">{title}</h1>
        <div className="splash-loader" aria-hidden="true" />
      </div>
    </div>
  );
}