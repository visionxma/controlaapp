export interface Product {
  id: string
  name: string
  costPrice: number
  salePrice: number
  profit: number
  initialStock: number
  currentStock: number
  imageUrl?: string
  createdAt: Date
  updatedAt: Date
  userId: string
}

export interface StockEntry {
  id: string
  productId: string
  quantity: number
  receivedBy: string
  receivedFrom: string
  date: Date
  userId: string
}

export interface Sale {
  id: string
  productId: string
  quantity: number
  totalValue: number
  profit: number
  paymentMethod: "pix" | "dinheiro" | "cartao" | "fiado"
  date: Date
  userId: string
}
