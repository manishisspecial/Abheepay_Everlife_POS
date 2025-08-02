-- Script to generate 1000 soundbox machines for the database
-- Run this script after the main schema.sql to populate all soundbox machines

-- Generate 1000 soundbox machines
DO $$
DECLARE
    i INTEGER;
    serial_num VARCHAR(10);
    mid_num VARCHAR(15);
    tid_num VARCHAR(15);
    qr_code VARCHAR(20);
    has_standee BOOLEAN;
BEGIN
    FOR i IN 1..1000 LOOP
        -- Generate serial number (SB000001 to SB001000)
        serial_num := 'SB' || LPAD(i::TEXT, 6, '0');
        
        -- Generate MID (MIDSB000001 to MIDSB001000)
        mid_num := 'MIDSB' || LPAD(i::TEXT, 6, '0');
        
        -- Generate TID (TIDSB000001 to TIDSB001000)
        tid_num := 'TIDSB' || LPAD(i::TEXT, 6, '0');
        
        -- Generate QR code (QR_SB000001 to QR_SB001000)
        qr_code := 'QR_SB' || LPAD(i::TEXT, 6, '0');
        
        -- Randomly assign standee (50% chance)
        has_standee := (RANDOM() > 0.5);
        
        -- Insert the soundbox machine
        INSERT INTO machines (serial_number, mid, tid, machine_type, model, manufacturer, qr_code, has_standee)
        VALUES (serial_num, mid_num, tid_num, 'SOUNDBOX', 'SoundBox-1000', 'Abheepay', qr_code, has_standee)
        ON CONFLICT (serial_number) DO NOTHING;
        
    END LOOP;
END $$;

-- Verify the count
SELECT 
    COUNT(*) as total_machines,
    COUNT(CASE WHEN machine_type = 'POS' THEN 1 END) as pos_machines,
    COUNT(CASE WHEN machine_type = 'SOUNDBOX' THEN 1 END) as soundbox_machines,
    COUNT(CASE WHEN status = 'AVAILABLE' THEN 1 END) as available_machines,
    COUNT(CASE WHEN status = 'ASSIGNED' THEN 1 END) as assigned_machines
FROM machines; 