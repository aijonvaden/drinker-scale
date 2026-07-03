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
}
