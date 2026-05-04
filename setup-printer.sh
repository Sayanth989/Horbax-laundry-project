#!/bin/bash
# ============================================
# TVS RP 3160 Gold — Printer Fix Script
# ============================================

echo "🖨️  Fixing TVS RP 3160 Gold setup..."
echo ""

# Step 1: Enable FileDevice in CUPS config
echo "Step 1: Enabling FileDevice in CUPS config..."
sudo sed -i 's/^#FileDevice No/FileDevice Yes/' /etc/cups/cups-files.conf

# Verify the change
if grep -q "^FileDevice Yes" /etc/cups/cups-files.conf; then
    echo "✅ FileDevice enabled"
else
    # If the sed didn't match, add it manually
    echo "FileDevice Yes" | sudo tee -a /etc/cups/cups-files.conf > /dev/null
    echo "✅ FileDevice added"
fi

# Step 2: Make sure the device link exists and has permissions
echo ""
echo "Step 2: Setting up device permissions..."

# Get the USB bus info
BUSDEV=$(lsusb | grep "154f:154f" | head -1 | sed 's/Bus \([0-9]*\) Device \([0-9]*\).*/\1 \2/')
BUS=$(echo $BUSDEV | awk '{print $1}')
DEV=$(echo $BUSDEV | awk '{print $2}')

if [ -n "$BUS" ] && [ -n "$DEV" ]; then
    echo "✅ SNBC device on Bus $BUS Device $DEV"
    sudo chmod 666 /dev/bus/usb/$BUS/$DEV
    
    sudo mkdir -p /dev/usb
    sudo rm -f /dev/usb/lp0
    sudo ln -sf /dev/bus/usb/$BUS/$DEV /dev/usb/lp0
    sudo chmod 666 /dev/usb/lp0
    echo "✅ Device link: /dev/usb/lp0 → /dev/bus/usb/$BUS/$DEV"
else
    echo "❌ SNBC device not found on USB!"
    exit 1
fi

# Step 3: Restart CUPS to apply config change
echo ""
echo "Step 3: Restarting CUPS..."
sudo systemctl restart cups
sleep 3

# Step 4: Remove old printer entry
sudo lpadmin -x TVS-RP3160-Gold 2>/dev/null

# Step 5: Find a suitable PPD for text-only printing
echo ""
echo "Step 4: Finding best driver..."
PPD=$(lpinfo -m 2>/dev/null | grep -i "text" | head -1 | awk '{print $1}')

if [ -z "$PPD" ]; then
    # Try generic postscript
    PPD=$(lpinfo -m 2>/dev/null | grep -i "Generic.*PostScript" | head -1 | awk '{print $1}')
fi

if [ -z "$PPD" ]; then
    PPD="raw"
    echo "⚠️  Using raw driver (no text PPD found)"
else
    echo "✅ Using driver: $PPD"
fi

# Step 6: Add the printer
echo ""
echo "Step 5: Adding printer to CUPS..."
if [ "$PPD" = "raw" ]; then
    sudo lpadmin -p TVS-RP3160-Gold \
        -E \
        -v "file:///dev/usb/lp0" \
        -m raw \
        -D "TVS RP 3160 Gold Thermal Receipt Printer" \
        -L "Counter"
else
    sudo lpadmin -p TVS-RP3160-Gold \
        -E \
        -v "file:///dev/usb/lp0" \
        -m "$PPD" \
        -D "TVS RP 3160 Gold Thermal Receipt Printer" \
        -L "Counter"
fi

# Step 7: Set as default and enable
echo "Step 6: Setting as default and enabling..."
sudo lpadmin -d TVS-RP3160-Gold
sudo cupsenable TVS-RP3160-Gold 2>/dev/null
sudo cupsaccept TVS-RP3160-Gold 2>/dev/null

echo ""
echo "============================================"
echo "  Verification:"
echo "============================================"
lpstat -p -d 2>/dev/null
echo ""

# Quick test: send a tiny test string directly to the device
echo "Step 7: Sending quick test to printer..."
echo -e "\n\n    === TVS RP 3160 TEST ===\n    Printer is working!\n    $(date)\n\n\n\n" | sudo tee /dev/usb/lp0 > /dev/null 2>&1

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 A test line was sent directly to the printer!"
    echo "   Check if paper came out. If yes, the printer works!"
else
    echo "⚠️  Direct write to /dev/usb/lp0 failed."
    echo "   The device link might not be a printer endpoint."
fi

echo ""
echo "✅ Done! Now refresh the browser print dialog."
