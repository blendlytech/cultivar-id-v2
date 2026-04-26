import { supabaseAdmin as supabase } from '@/lib/supabaseAdmin';

/**
 * ✦ Elite Service
 * Handles the logic for the Elite 100 Founders Program.
 */
export const eliteService = {
  /**
   * Checks how many Elite seats are remaining.
   */
  async getRemainingSeats() {
    const { count, error } = await supabase
      .from('vendors')
      .select('*', { count: 'exact', head: true })
      .eq('account_tier', 'elite');

    if (error) throw error;
    return 100 - (count || 0);
  },

  /**
   * Assigns the next available Elite seat (1-100).
   */
  async assignNextSeat(vendorId: string) {
    // 1. Check current elite count
    const { data: eliteVendors, error: fetchError } = await supabase
      .from('vendors')
      .select('elite_number')
      .eq('tier', 'elite')
      .order('elite_number', { ascending: false });

    if (fetchError) throw fetchError;

    // 2. Determine next number
    const nextNumber = eliteVendors.length > 0 
      ? (eliteVendors[0].elite_number || 0) + 1 
      : 1;

    if (nextNumber > 100) {
      throw new Error("No Elite seats remaining. The program is currently closed.");
    }

    // 3. Update Vendor Status
    const { data: updatedVendor, error: updateError } = await supabase
      .from('vendors')
      .update({
        tier: 'elite',
        is_elite: true,
        elite_number: nextNumber,
        subscription_status: 'active'
      })
      .eq('id', vendorId)
      .select()
      .single();

    if (updateError) throw updateError;

    // 4. Trigger Badge Generation (Simulated)
    // In a production app, this would call a Webhook or an Edge Function 
    // that uses DALL-E/Imagen to generate the badge with the vendor's name.
    console.log(`[EliteService] Seat #${nextNumber} assigned to ${updatedVendor.name}.`);
    console.log(`[EliteService] Triggering Badge Generation for ELT-${nextNumber}-${vendorId.slice(0, 4)}...`);

    return {
      seatNumber: nextNumber,
      vendor: updatedVendor
    };
  }
};
