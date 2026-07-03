export type ShopItemType = 'book' | 'drinkware' | 'collectible' | 'apparel' | 'pod'

export interface ShopItem {
  id: string
  title: string
  type: ShopItemType
  price: string
  url: string
  note?: string
}

export const LEGEND_SHOP: Record<string, ShopItem[]> = {
  'oscar-wilde': [
    {
      id: 'wilde-book-1',
      title: 'The Soul of Man Under Socialism & De Profundis',
      type: 'book',
      price: '$9.99',
      url: 'https://amzn.to/4p1YehR',
      note: 'Two essential works in one volume',
    },
    {
      id: 'wilde-book-2',
      title: 'Complete Short Fiction (Penguin Classics)',
      type: 'book',
      price: '$14.73',
      url: 'https://amzn.to/4y6TKLi',
      note: 'The fairy tales, stories, and poems in prose',
    },
    {
      id: 'wilde-drinkware-1',
      title: 'Vintage Absinthe Spoon Set',
      type: 'drinkware',
      price: '$11.34',
      url: 'https://amzn.to/4oWWI0s',
      note: 'Drink it as Wilde did — slowly, ritually, green',
    },
  ],
  'andre': [
    {
      id: 'andre-art-1',
      title: 'The French Alps Wall Art Poster Print (Black Frame, 20x16)',
      type: 'collectible',
      price: '$45.95',
      url: 'https://amzn.to/4aBfJQf',
      note: 'Where the Giant was born — the French Alps that made him',
    },
    {
      id: 'andre-apparel-1',
      title: 'Andre The Giant — That’s A Lot Of Beer T-Shirt',
      type: 'apparel',
      price: '$19.95',
      url: 'https://amzn.to/4wpZgXC',
      note: 'It is, in fact, a lot of beer.',
    },
    {
      id: 'andre-sticker-1',
      title: 'André The Giant Has a Posse Vinyl Bumper Sticker (5")',
      type: 'collectible',
      price: '$4.95',
      url: 'https://amzn.to/3Tgux0F',
      note: 'The iconic Shepard Fairey image.',
    },
  ],
}
