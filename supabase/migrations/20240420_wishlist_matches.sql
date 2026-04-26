-- Migration: Wishlist Matching Engine & Early Access
-- ✦ Elite 100: 24hr Head Start Logic

CREATE TABLE IF NOT EXISTS wishlist_matches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wishlist_id UUID REFERENCES wishlists(id) ON DELETE CASCADE,
    inventory_id UUID REFERENCES inventory(id) ON DELETE CASCADE,
    vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE,
    
    -- Matching Details
    match_score INTEGER DEFAULT 100, -- Future-proofing for partial matches
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Notification Logic (24hr Head Start)
    elite_notified_at TIMESTAMP WITH TIME ZONE,
    general_notified_at TIMESTAMP WITH TIME ZONE,
    
    UNIQUE(wishlist_id, inventory_id)
);

-- Index for fast lookup of pending notifications
CREATE INDEX IF NOT EXISTS idx_pending_notifications ON wishlist_matches (general_notified_at) WHERE general_notified_at IS NULL;

COMMENT ON TABLE wishlist_matches IS 'Tracks matches between user wishlists and vendor inventory with Elite early access logic.';
