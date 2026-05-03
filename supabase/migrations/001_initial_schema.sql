-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE user_role AS ENUM ('customer', 'producer');
CREATE TYPE request_status AS ENUM ('open', 'closed', 'fulfilled');
CREATE TYPE offer_status AS ENUM ('pending', 'accepted', 'rejected');
CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'in_progress', 'shipped', 'delivered', 'cancelled');
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');

-- Create users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    role user_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create producer_profiles table
CREATE TABLE producer_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    company_name TEXT NOT NULL,
    description TEXT,
    location TEXT,
    contact_info JSONB,
    rating FLOAT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create products table
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    producer_id UUID REFERENCES producer_profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    category TEXT,
    images JSONB DEFAULT '[]',
    specifications JSONB,
    stock_quantity INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create requests table
CREATE TABLE requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT,
    budget DECIMAL(10,2),
    deadline DATE,
    status request_status DEFAULT 'open',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create offers table
CREATE TABLE offers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_id UUID REFERENCES requests(id) ON DELETE CASCADE,
    producer_id UUID REFERENCES producer_profiles(id) ON DELETE CASCADE,
    price DECIMAL(10,2) NOT NULL,
    description TEXT,
    estimated_time INTEGER, -- in days
    status offer_status DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create orders table
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES users(id) ON DELETE CASCADE,
    producer_id UUID REFERENCES producer_profiles(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    request_id UUID REFERENCES requests(id) ON DELETE SET NULL,
    quantity INTEGER DEFAULT 1,
    total_price DECIMAL(10,2) NOT NULL,
    status order_status DEFAULT 'pending',
    shipping_address JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create payments table
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    status payment_status DEFAULT 'pending',
    payment_method TEXT,
    transaction_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create reviews table
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    reviewer_id UUID REFERENCES users(id) ON DELETE CASCADE,
    reviewee_id UUID REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE producer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view their own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for producer_profiles table
CREATE POLICY "Producers can view their own profile" ON producer_profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Producers can update their own profile" ON producer_profiles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Producers can insert their own profile" ON producer_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anyone can view producer profiles" ON producer_profiles
    FOR SELECT USING (true);

-- RLS Policies for products table
CREATE POLICY "Anyone can view products" ON products
    FOR SELECT USING (true);

CREATE POLICY "Producers can manage their own products" ON products
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM producer_profiles
            WHERE producer_profiles.id = products.producer_id
            AND producer_profiles.user_id = auth.uid()
        )
    );

-- RLS Policies for requests table
CREATE POLICY "Customers can manage their own requests" ON requests
    FOR ALL USING (auth.uid() = customer_id);

CREATE POLICY "Producers can view all requests" ON requests
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role = 'producer'
        )
    );

-- RLS Policies for offers table
CREATE POLICY "Producers can manage their own offers" ON offers
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM producer_profiles
            WHERE producer_profiles.id = offers.producer_id
            AND producer_profiles.user_id = auth.uid()
        )
    );

CREATE POLICY "Customers can view offers on their requests" ON offers
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM requests
            WHERE requests.id = offers.request_id
            AND requests.customer_id = auth.uid()
        )
    );

-- RLS Policies for orders table
CREATE POLICY "Customers can view their own orders" ON orders
    FOR SELECT USING (auth.uid() = customer_id);

CREATE POLICY "Producers can view orders for their products/requests" ON orders
    FOR SELECT USING (
        auth.uid() = producer_id OR
        EXISTS (
            SELECT 1 FROM producer_profiles
            WHERE producer_profiles.id = orders.producer_id
            AND producer_profiles.user_id = auth.uid()
        )
    );

CREATE POLICY "Customers can create orders" ON orders
    FOR INSERT WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Producers can update order status for their orders" ON orders
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM producer_profiles
            WHERE producer_profiles.id = orders.producer_id
            AND producer_profiles.user_id = auth.uid()
        )
    );

-- RLS Policies for payments table
CREATE POLICY "Customers can view payments for their orders" ON payments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM orders
            WHERE orders.id = payments.order_id
            AND orders.customer_id = auth.uid()
        )
    );

CREATE POLICY "Producers can view payments for their orders" ON payments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM orders
            WHERE orders.id = payments.order_id
            AND orders.producer_id = auth.uid()
        )
    );

-- RLS Policies for reviews table
CREATE POLICY "Anyone can view reviews" ON reviews
    FOR SELECT USING (true);

CREATE POLICY "Users can create reviews for their completed orders" ON reviews
    FOR INSERT WITH CHECK (
        auth.uid() = reviewer_id AND
        EXISTS (
            SELECT 1 FROM orders
            WHERE orders.id = reviews.order_id
            AND (orders.customer_id = auth.uid() OR orders.producer_id = auth.uid())
            AND orders.status = 'delivered'
        )
    );

-- Create indexes for better performance
CREATE INDEX idx_producer_profiles_user_id ON producer_profiles(user_id);
CREATE INDEX idx_products_producer_id ON products(producer_id);
CREATE INDEX idx_requests_customer_id ON requests(customer_id);
CREATE INDEX idx_offers_request_id ON offers(request_id);
CREATE INDEX idx_offers_producer_id ON offers(producer_id);
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_producer_id ON orders(producer_id);
CREATE INDEX idx_orders_product_id ON orders(product_id);
CREATE INDEX idx_orders_request_id ON orders(request_id);
CREATE INDEX idx_payments_order_id ON payments(order_id);
CREATE INDEX idx_reviews_order_id ON reviews(order_id);
CREATE INDEX idx_reviews_reviewer_id ON reviews(reviewer_id);
CREATE INDEX idx_reviews_reviewee_id ON reviews(reviewee_id);