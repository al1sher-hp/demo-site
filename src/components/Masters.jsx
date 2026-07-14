export default function Masters({ masters, services }) {
  function specialtiesFor(master) {
    return master.services
      .map((id) => services.find((s) => s.id === id)?.name)
      .filter(Boolean)
      .join(', ');
  }

  return (
    <section className="section" id="ustalar">
      <div className="section-inner">
        <div className="section-head">
          <span className="section-eyebrow">Jamoa</span>
          <h2 className="section-title">Mutaxassislarimiz</h2>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            Tajribali va o'z sohasining professional mutaxassislari.
          </p>
        </div>
        <div className="masters-grid">
          {masters.map((m) => (
            <div className="master-tile" key={m.id}>
              <div className={`master-tile-avatar avatar-${m.id}`}>{m.name[0]}</div>
              <div className="master-tile-name">{m.name}</div>
              <div className="master-tile-role">{specialtiesFor(m)}</div>
              <div className="master-tile-rating">⭐ {m.rating}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
