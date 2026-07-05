import { LEGEND_SHOP } from '../data/shop'
import type { ShopItem } from '../data/shop'

const TYPE_LABEL: Record<ShopItem['type'], string> = {
  book: 'Book',
  drinkware: 'Drinkware',
  collectible: 'Collectible',
  apparel: 'Apparel',
  pod: 'Limited Edition',
}

export default function ShopCards({ legendId, accent }: { legendId: string; accent: string }) {
  const items = LEGEND_SHOP[legendId]
  if (!items || items.length === 0) return null

  return (
    <div className="shop-cards-section">
      <div className="rule" style={{ maxWidth: 200, margin: '0 auto 16px' }} />
      <p className="shop-cards-heading">From the Legend’s Collection</p>
      <div className="shop-cards-grid">
        {items.map((item) => (
          <a
            key={item.id}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="shop-card"
            style={{ borderColor: `\${accent}33` }}
          >
            <span className="shop-card-type" style={{ color: accent }}>
              {TYPE_LABEL[item.type]}
            </span>
            <span className="shop-card-title">{item.title}</span>
            {item.note && <span className="shop-card-note">{item.note}</span>}

            <span className="shop-card-cta">Visit the Purveyor →</span>
          </a>
        ))}
      </div>
    </div>
  )
}
