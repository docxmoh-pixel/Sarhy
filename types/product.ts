export interface Product {
  id: string;
  title: string;
  price_halalas: number;
  description?: string;
  category?: string;
  subcategory?: string;
  product_files?: { storage_path: string; original_name?: string }[];
  fulfillment_type?: string;
}

export interface CartItem {
  id: string;
  product_id: string;
  user_id: string;
  quantity: number;
  products: Product;
}
