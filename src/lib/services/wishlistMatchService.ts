import { supabaseAdmin as supabase } from '@/lib/supabaseAdmin';
import { notificationService } from './notificationService';

/**
 * 🌿 Wishlist Matching Engine
 * Strategy: Fast-track leads to Elite vendors to drive rapid ROI.
 */
export const wishlistMatchService = {
  /**
   * Called when a user adds an item to their wishlist.
   * Finds all vendors who have this item and creates match records.
   */
  async processNewWishlistItem(wishlistId: string, speciesName: string) {
    // 1. Find all inventory items that match this species
    const { data: matches, error: matchError } = await supabase
      .from('inventory')
      .select('id, vendor_id, vendors(tier, name, contact_email)')
      .ilike('species_name', `%${speciesName}%`);

    if (matchError) throw matchError;

    // 2. Create match records and notify Elite vendors
    const matchRecords = [];
    
    for (const m of matches) {
      const vendor: any = m.vendors;
      const isElite = vendor.tier === 'elite';
      
      matchRecords.push({
        wishlist_id: wishlistId,
        inventory_id: m.id,
        vendor_id: m.vendor_id,
        // Elite notified NOW, others notified in 24 hours
        elite_notified_at: isElite ? new Date().toISOString() : null,
        general_notified_at: isElite ? new Date().toISOString() : null,
        created_at: new Date().toISOString(),
      });

      // INSTANT NOTIFICATION for Elite vendors
      if (isElite && vendor.contact_email) {
        try {
          await notificationService.sendLeadNotification(
            vendor.contact_email,
            vendor.name,
            speciesName,
            true
          );
        } catch (err) {
          console.error(`Failed to send Elite notification to ${vendor.contact_email}:`, err);
        }
      }
    }

    if (matchRecords.length > 0) {
      const { error: insertError } = await supabase
        .from('wishlist_matches')
        .insert(matchRecords);
      
      if (insertError) throw insertError;
    }

    return matchRecords.length;
  },

  /**
   * Cron Job Handler: Finds matches that have passed the 24hr Elite window
   * and marks them as ready for general notification.
   */
  async releaseDelayedLeads() {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    const { data: pendingMatches, error: fetchError } = await supabase
      .from('wishlist_matches')
      .select(`
        id, 
        vendor_id, 
        wishlists(species_name),
        vendors(tier, name, contact_email)
      `)
      .is('general_notified_at', null)
      .lt('created_at', twentyFourHoursAgo);

    if (fetchError) throw fetchError;

    if (pendingMatches.length > 0) {
      for (const match of pendingMatches) {
        const vendor: any = match.vendors;
        const wishlist: any = match.wishlists;

        // Notify non-Elite vendor now
        if (vendor && vendor.contact_email) {
          try {
            await notificationService.sendLeadNotification(
              vendor.contact_email,
              vendor.name,
              wishlist.species_name,
              false
            );
          } catch (err) {
            console.error(`Failed to send General notification to ${vendor.contact_email}:`, err);
          }
        }

        // Mark as notified
        await supabase
          .from('wishlist_matches')
          .update({ general_notified_at: new Date().toISOString() })
          .eq('id', match.id);
      }
    }

    return pendingMatches.length;
  },

  /**
   * Fetches active leads for a specific vendor.
   */
  async getVendorLeads(vendorId: string) {
    const { data, error } = await supabase
      .from('wishlist_matches')
      .select(`
        id,
        created_at,
        general_notified_at,
        wishlists (
          species_name,
          user_id
        ),
        inventory (
          species_name,
          variety,
          price
        )
      `)
      .eq('vendor_id', vendorId)
      .not('general_notified_at', 'is', null) // Only show leads they are allowed to see
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }
};
