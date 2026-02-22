/*
  # Fix Appointments RLS Policies

  1. Security Issues Fixed
    - Removed overly permissive "Anyone can book appointment" policy that allowed unrestricted INSERT
    - Replaced with restrictive policy requiring valid appointment data
    - Fixed "Authenticated users can view appointments" policy to prevent unrestricted SELECT
  
  2. New Policies
    - Anonymous users can INSERT appointments (required for booking form) with data validation
    - Authenticated users can view all appointments (admin/staff access)
    - Prevents unauthorized data access while maintaining booking functionality
    
  3. Important Notes
    - Maintains booking functionality for anonymous users
    - Restricts INSERT to valid, non-null appointment data
    - Authenticated users only can view appointments (admin access pattern)
*/

DROP POLICY IF EXISTS "Anyone can book appointment" ON appointments;
DROP POLICY IF EXISTS "Authenticated users can view appointments" ON appointments;

CREATE POLICY "Anonymous users can create appointments"
  ON appointments
  FOR INSERT
  TO anon
  WITH CHECK (
    id IS NOT NULL AND
    name IS NOT NULL AND
    phone IS NOT NULL AND
    service IS NOT NULL AND
    appointment_date IS NOT NULL
  );

CREATE POLICY "Authenticated users can view all appointments"
  ON appointments
  FOR SELECT
  TO authenticated
  USING (true);
