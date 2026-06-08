import React, { useState } from 'react';
import { useUserProfile } from '../hooks/useUserProfile';

export function UserProfileDebug() {
  const {
    favorites,
    toggleFavorite,
    realms,
    createRealm,
    updateRealm,
    deleteRealm,
    analytics,
    simulateReview,
    milestones,
    communityStats
  } = useUserProfile();

  const [favInput, setFavInput] = useState('');
  const [realmInputTitle, setRealmInputTitle] = useState('');

  return (
    <div style={{ padding: '20px', backgroundColor: '#111', color: '#0f0', fontFamily: 'monospace', height: '100%', overflowY: 'auto' }}>
      <h1>🛠️ USER PROFILE SYSTEM (CORE LOGIC DEBUG) 🛠️</h1>
      
      <section style={{ margin: '20px 0', border: '1px solid #0f0', padding: '10px' }}>
        <h2>1. Favorites (Bookmarks)</h2>
        <p>Favorited IDs: {JSON.stringify(favorites)}</p>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input 
            type="text" 
            value={favInput} 
            onChange={e => setFavInput(e.target.value)} 
            placeholder="Item ID"
            style={{ color: '#000' }}
          />
          <button onClick={() => toggleFavorite(favInput || 'test_id')} style={{ backgroundColor: '#333', color: '#0f0', padding: '5px' }}>
            Toggle Favorite
          </button>
        </div>
      </section>

      <section style={{ margin: '20px 0', border: '1px solid #0f0', padding: '10px' }}>
        <h2>2. My Realms (Custom Packages)</h2>
        <pre>{JSON.stringify(realms, null, 2)}</pre>
        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          <input 
            type="text" 
            value={realmInputTitle} 
            onChange={e => setRealmInputTitle(e.target.value)} 
            placeholder="New Realm Title"
            style={{ color: '#000' }}
          />
          <button 
            onClick={() => createRealm({ title: realmInputTitle || 'New Temp Realm', description: 'Test description', cardCount: 0 })}
            style={{ backgroundColor: '#333', color: '#0f0', padding: '5px' }}
          >
            Create Realm
          </button>
        </div>
        {realms.length > 0 && (
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button 
              onClick={() => updateRealm(realms[0].id, { title: realms[0].title + ' (Updated)' })}
              style={{ backgroundColor: '#333', color: '#0f0', padding: '5px' }}
            >
              Update 1st Realm
            </button>
            <button 
              onClick={() => deleteRealm(realms[0].id)}
              style={{ backgroundColor: '#333', color: '#0f0', padding: '5px', borderColor: '#f00', borderStyle: 'solid' }}
            >
              Delete 1st Realm
            </button>
          </div>
        )}
      </section>

      <section style={{ margin: '20px 0', border: '1px solid #0f0', padding: '10px' }}>
        <h2>3. Analytics & SM-2 Stats</h2>
        <pre>{JSON.stringify(analytics, null, 2)}</pre>
        <button 
          onClick={simulateReview}
          style={{ backgroundColor: '#333', color: '#0f0', padding: '5px', marginTop: '10px' }}
        >
          Simulate +1 Card Review
        </button>
      </section>

      <section style={{ margin: '20px 0', border: '1px solid #0f0', padding: '10px' }}>
        <h2>4. Milestones (Traguardi)</h2>
        <i>(Tip: Simulate card reviews to automatically unlock Milestones)</i>
        <ul style={{ marginTop: '10px' }}>
          {milestones.map(m => (
            <li key={m.id}>
              [{m.unlocked ? 'X' : ' '}] {m.title} (Requires {m.requirement} reviews)
            </li>
          ))}
        </ul>
      </section>

      <section style={{ margin: '20px 0', border: '1px solid #0f0', padding: '10px' }}>
        <h2>5. Community Impact (Il Salotto Stats)</h2>
        <pre>{JSON.stringify(communityStats, null, 2)}</pre>
      </section>
    </div>
  );
}
