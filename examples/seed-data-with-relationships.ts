/**
 * Example seed data để test Dynamic CMS với Relationships
 *
 * Usage:
 * 1. Tạo database trước
 * 2. Tạo các collection schemas
 * 3. Seed data theo thứ tự: users → products → orders
 */

export const exampleSchemas = {
  // Schema cho Users collection
  users: {
    name: 'users',
    displayName: 'Users',
    description: 'User accounts and profiles',
    icon: 'user',
    fields: [
      {
        name: 'name',
        label: 'Full Name',
        type: 'string',
        validation: { required: true, minLength: 2, maxLength: 100 },
        searchable: true,
        showInList: true,
        order: 1,
      },
      {
        name: 'email',
        label: 'Email Address',
        type: 'email',
        validation: { required: true },
        searchable: true,
        showInList: true,
        order: 2,
      },
      {
        name: 'phone',
        label: 'Phone Number',
        type: 'string',
        validation: { pattern: '^\\+?[0-9]{10,15}$' },
        showInList: true,
        order: 3,
      },
      {
        name: 'address',
        label: 'Address',
        type: 'textarea',
        order: 4,
      },
      {
        name: 'date_of_birth',
        label: 'Date of Birth',
        type: 'date',
        order: 5,
      },
      {
        name: 'is_active',
        label: 'Active Status',
        type: 'boolean',
        defaultValue: true,
        showInList: true,
        order: 6,
      },
    ],
    timestamps: true,
    softDelete: true,
    enableApi: true,
  },

  // Schema cho Products collection
  products: {
    name: 'products',
    displayName: 'Products',
    description: 'Product catalog and inventory',
    icon: 'shopping-cart',
    fields: [
      {
        name: 'product_name',
        label: 'Product Name',
        type: 'string',
        validation: { required: true, minLength: 3 },
        searchable: true,
        showInList: true,
        order: 1,
      },
      {
        name: 'sku',
        label: 'SKU',
        type: 'string',
        validation: { required: true },
        showInList: true,
        order: 2,
      },
      {
        name: 'price',
        label: 'Price',
        type: 'number',
        validation: { required: true, min: 0 },
        showInList: true,
        order: 3,
      },
      {
        name: 'category',
        label: 'Category',
        type: 'select',
        options: [
          { label: 'Electronics', value: 'electronics' },
          { label: 'Clothing', value: 'clothing' },
          { label: 'Books', value: 'books' },
          { label: 'Home & Garden', value: 'home_garden' },
          { label: 'Sports', value: 'sports' },
        ],
        validation: { required: true },
        searchable: true,
        showInList: true,
        order: 4,
      },
      {
        name: 'description',
        label: 'Description',
        type: 'textarea',
        searchable: true,
        order: 5,
      },
      {
        name: 'in_stock',
        label: 'In Stock',
        type: 'boolean',
        defaultValue: true,
        showInList: true,
        order: 6,
      },
      {
        name: 'stock_quantity',
        label: 'Stock Quantity',
        type: 'number',
        validation: { min: 0 },
        showInList: true,
        order: 7,
      },
      {
        name: 'images',
        label: 'Product Images',
        type: 'array',
        order: 8,
      },
      {
        name: 'tags',
        label: 'Tags',
        type: 'multi_select',
        options: [
          { label: 'New', value: 'new' },
          { label: 'Bestseller', value: 'bestseller' },
          { label: 'Sale', value: 'sale' },
          { label: 'Featured', value: 'featured' },
        ],
        order: 9,
      },
    ],
    timestamps: true,
    softDelete: true,
    enableApi: true,
  },

  // Schema cho Orders collection (với relationships)
  orders: {
    name: 'orders',
    displayName: 'Orders',
    description: 'Customer orders and transactions',
    icon: 'shopping-bag',
    fields: [
      {
        name: 'order_number',
        label: 'Order Number',
        type: 'string',
        validation: { required: true },
        searchable: true,
        showInList: true,
        order: 1,
      },
      {
        name: 'customer',
        label: 'Customer',
        type: 'reference',
        validation: { required: true },
        referenceConfig: {
          collection: 'users',
          displayField: 'name',
          multiple: false,
          relationType: 'many_to_one',
          autoPopulate: true,
          populateFields: ['name', 'email', 'phone'],
          populateDepth: 1,
        },
        showInList: true,
        order: 2,
      },
      {
        name: 'products',
        label: 'Products',
        type: 'reference',
        validation: { required: true },
        referenceConfig: {
          collection: 'products',
          displayField: 'product_name',
          multiple: true,
          relationType: 'many_to_many',
          autoPopulate: true,
          populateFields: ['product_name', 'sku', 'price', 'in_stock'],
          populateDepth: 1,
        },
        order: 3,
      },
      {
        name: 'total_amount',
        label: 'Total Amount',
        type: 'number',
        validation: { required: true, min: 0 },
        showInList: true,
        order: 4,
      },
      {
        name: 'status',
        label: 'Order Status',
        type: 'select',
        options: [
          { label: 'Pending', value: 'pending' },
          { label: 'Processing', value: 'processing' },
          { label: 'Shipped', value: 'shipped' },
          { label: 'Delivered', value: 'delivered' },
          { label: 'Cancelled', value: 'cancelled' },
        ],
        defaultValue: 'pending',
        showInList: true,
        order: 5,
      },
      {
        name: 'payment_method',
        label: 'Payment Method',
        type: 'select',
        options: [
          { label: 'Credit Card', value: 'credit_card' },
          { label: 'PayPal', value: 'paypal' },
          { label: 'Cash on Delivery', value: 'cod' },
          { label: 'Bank Transfer', value: 'bank_transfer' },
        ],
        order: 6,
      },
      {
        name: 'shipping_address',
        label: 'Shipping Address',
        type: 'textarea',
        validation: { required: true },
        order: 7,
      },
      {
        name: 'tracking_number',
        label: 'Tracking Number',
        type: 'string',
        order: 8,
      },
      {
        name: 'notes',
        label: 'Order Notes',
        type: 'textarea',
        order: 9,
      },
      {
        name: 'order_date',
        label: 'Order Date',
        type: 'datetime',
        validation: { required: true },
        showInList: true,
        order: 10,
      },
    ],
    timestamps: true,
    softDelete: true,
    enableApi: true,
  },
};

export const exampleData = {
  // Sample users
  users: [
    {
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1234567890',
      address: '123 Main Street, New York, NY 10001',
      date_of_birth: '1990-05-15',
      is_active: true,
    },
    {
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '+1234567891',
      address: '456 Oak Avenue, Los Angeles, CA 90001',
      date_of_birth: '1988-08-22',
      is_active: true,
    },
    {
      name: 'Bob Johnson',
      email: 'bob.johnson@example.com',
      phone: '+1234567892',
      address: '789 Pine Road, Chicago, IL 60601',
      date_of_birth: '1985-03-10',
      is_active: true,
    },
    {
      name: 'Alice Williams',
      email: 'alice.williams@example.com',
      phone: '+1234567893',
      address: '321 Elm Street, Houston, TX 77001',
      date_of_birth: '1992-11-30',
      is_active: true,
    },
  ],

  // Sample products
  products: [
    {
      product_name: 'iPhone 15 Pro',
      sku: 'IPHONE-15-PRO',
      price: 999.99,
      category: 'electronics',
      description: 'Latest iPhone with advanced features',
      in_stock: true,
      stock_quantity: 50,
      images: ['iphone15-1.jpg', 'iphone15-2.jpg'],
      tags: ['new', 'bestseller'],
    },
    {
      product_name: 'MacBook Pro 16"',
      sku: 'MACBOOK-PRO-16',
      price: 2499.99,
      category: 'electronics',
      description: 'Powerful laptop for professionals',
      in_stock: true,
      stock_quantity: 30,
      images: ['macbook-1.jpg', 'macbook-2.jpg'],
      tags: ['new', 'featured'],
    },
    {
      product_name: 'Nike Running Shoes',
      sku: 'NIKE-RUN-001',
      price: 129.99,
      category: 'sports',
      description: 'Comfortable running shoes',
      in_stock: true,
      stock_quantity: 100,
      images: ['nike-shoes-1.jpg'],
      tags: ['sale', 'bestseller'],
    },
    {
      product_name: 'The Great Gatsby',
      sku: 'BOOK-GATSBY',
      price: 15.99,
      category: 'books',
      description: 'Classic American novel',
      in_stock: true,
      stock_quantity: 200,
      images: ['gatsby-cover.jpg'],
      tags: ['featured'],
    },
    {
      product_name: 'Smart Watch',
      sku: 'SMARTWATCH-001',
      price: 299.99,
      category: 'electronics',
      description: 'Fitness tracker and smartwatch',
      in_stock: true,
      stock_quantity: 75,
      images: ['smartwatch-1.jpg', 'smartwatch-2.jpg'],
      tags: ['new', 'sale'],
    },
  ],

  // Sample orders (sử dụng reference IDs sau khi tạo users và products)
  ordersTemplate: {
    order1: {
      order_number: 'ORD-2025-001',
      customer: '<USER_ID_1>', // Replace với actual ID
      products: ['<PRODUCT_ID_1>', '<PRODUCT_ID_2>'], // Replace với actual IDs
      total_amount: 3499.98,
      status: 'processing',
      payment_method: 'credit_card',
      shipping_address: '123 Main Street, New York, NY 10001',
      tracking_number: 'TRK123456789',
      notes: 'Please deliver between 9 AM - 5 PM',
      order_date: '2025-12-01T10:30:00Z',
    },
    order2: {
      order_number: 'ORD-2025-002',
      customer: '<USER_ID_2>',
      products: ['<PRODUCT_ID_3>', '<PRODUCT_ID_4>'],
      total_amount: 145.98,
      status: 'shipped',
      payment_method: 'paypal',
      shipping_address: '456 Oak Avenue, Los Angeles, CA 90001',
      tracking_number: 'TRK987654321',
      notes: 'Gift wrap requested',
      order_date: '2025-12-02T14:15:00Z',
    },
    order3: {
      order_number: 'ORD-2025-003',
      customer: '<USER_ID_3>',
      products: ['<PRODUCT_ID_1>', '<PRODUCT_ID_5>'],
      total_amount: 1299.98,
      status: 'pending',
      payment_method: 'bank_transfer',
      shipping_address: '789 Pine Road, Chicago, IL 60601',
      notes: 'Awaiting payment confirmation',
      order_date: '2025-12-03T09:00:00Z',
    },
  },
};

/**
 * Script để seed data
 */
export const seedInstructions = `
# 1. Tạo Database
POST /databases
{
  "name": "ecommerce-demo",
  "displayName": "E-commerce Demo",
  "description": "Demo database for e-commerce with relationships"
}

# Lưu lại databaseId từ response

# 2. Tạo Collection Schemas
POST /:databaseId/collection-schemas
{
  "databaseId": "<DATABASE_ID>",
  ...exampleSchemas.users
}

POST /:databaseId/collection-schemas
{
  "databaseId": "<DATABASE_ID>",
  ...exampleSchemas.products
}

POST /:databaseId/collection-schemas
{
  "databaseId": "<DATABASE_ID>",
  ...exampleSchemas.orders
}

# 3. Seed Users
POST /:databaseId/users/bulk
[...exampleData.users]

# Lưu lại user IDs từ response

# 4. Seed Products
POST /:databaseId/products/bulk
[...exampleData.products]

# Lưu lại product IDs từ response

# 5. Seed Orders (replace <USER_ID_X> và <PRODUCT_ID_X> với actual IDs)
POST /:databaseId/orders
{
  "order_number": "ORD-2025-001",
  "customer": "actual-user-id-1",
  "products": ["actual-product-id-1", "actual-product-id-2"],
  ...
}

# 6. Test Populate
GET /:databaseId/orders?populate=true&populateDepth=1

# 7. Test Query
POST /:databaseId/orders/query
{
  "filter": {
    "status": "processing"
  },
  "sort": {
    "order_date": -1
  }
}
`;
