# VPN Auto-Reconnection Service

## 📋 Overview

The VPN auto-reconnection service monitors your VPN connection and automatically reconnects if it drops, ensuring your GitHub Actions self-hosted runner maintains continuous access to the staging environment.

## ✅ What's Installed

1. **Script**: `~/vpn-auto-reconnect.sh`
   - Monitors VPN connection every 30 seconds
   - Auto-reconnects if VPN drops
   - Restarts GitHub Actions runner after reconnection
   - Tests staging environment connectivity

2. **LaunchAgent Service**: `~/Library/LaunchAgents/com.mafid.vpn-auto-reconnect.plist`
   - Runs automatically on startup
   - Keeps the monitor running in background
   - Restarts if it crashes

3. **Log Files**:
   - Main log: `~/Library/Logs/vpn-auto-reconnect.log`
   - Stdout: `~/Library/Logs/vpn-auto-reconnect-stdout.log`
   - Stderr: `~/Library/Logs/vpn-auto-reconnect-stderr.log`

## 🎯 Features

✅ **Automatic VPN Reconnection**
- Detects when VPN disconnects
- Automatically reconnects within seconds
- No manual intervention needed

✅ **GitHub Runner Integration**
- Restarts runner service after VPN reconnects
- Ensures runner maintains GitHub connectivity
- Tests staging environment access

✅ **Comprehensive Logging**
- All events logged with timestamps
- Silent health checks (logs every 10th check)
- Alert on disconnections with details

✅ **macOS Notifications** (if terminal-notifier installed)
- Notifies when VPN disconnects
- Notifies when successfully reconnected

## 📊 Service Status

### Check if Service is Running
```bash
launchctl list | grep vpn-auto-reconnect
```
Expected output: `10217   0       com.mafid.vpn-auto-reconnect` (PID may vary)

### View Live Logs
```bash
# Main log (recommended)
tail -f ~/Library/Logs/vpn-auto-reconnect.log

# Last 50 lines
tail -50 ~/Library/Logs/vpn-auto-reconnect.log
```

### Check VPN Status Manually
```bash
scutil --nc status "AmmanOfficeVPN"
```

### Check Runner Status
```bash
cd ~/actions-runner && ./svc.sh status
```

## 🔧 Service Management

### Stop the Service
```bash
launchctl unload ~/Library/LaunchAgents/com.mafid.vpn-auto-reconnect.plist
```

### Start the Service
```bash
launchctl load ~/Library/LaunchAgents/com.mafid.vpn-auto-reconnect.plist
```

### Restart the Service
```bash
launchctl unload ~/Library/LaunchAgents/com.mafid.vpn-auto-reconnect.plist
launchctl load ~/Library/LaunchAgents/com.mafid.vpn-auto-reconnect.plist
```

### Disable Permanent ly (Prevent Autostart)
```bash
launchctl unload ~/Library/LaunchAgents/com.mafid.vpn-auto-reconnect.plist
rm ~/Library/LaunchAgents/com.mafid.vpn-auto-reconnect.plist
```

## ⚙️ Configuration

Edit the script to customize behavior:
```bash
nano ~/vpn-auto-reconnect.sh
```

**Key Settings**:
- `VPN_NAME="AmmanOfficeVPN"` - VPN connection name
- `CHECK_INTERVAL=30` - Check every 30 seconds
- `MAX_LOG_SIZE=10485760` - 10MB max log size before rotation

After editing, restart the service:
```bash
launchctl unload ~/Library/LaunchAgents/com.mafid.vpn-auto-reconnect.plist
launchctl load ~/Library/LaunchAgents/com.mafid.vpn-auto-reconnect.plist
```

## 📈 Log Output Examples

### Normal Operation (Health Check)
```
[2025-10-22 10:04:51] [INFO] VPN health check #10: Connected ✓
```

### VPN Disconnection Detected
```
[2025-10-22 12:46:48] [ERROR] ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[2025-10-22 12:46:48] [ERROR] VPN DISCONNECTED! (Disconnect #1)
[2025-10-22 12:46:48] [ERROR] Status: Disconnected
[2025-10-22 12:46:48] [ERROR] ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[2025-10-22 12:46:48] [INFO] Attempting to connect to AmmanOfficeVPN...
[2025-10-22 12:46:54] [SUCCESS] VPN connected successfully!
[2025-10-22 12:46:55] [INFO] VPN Details - Remote: 82.212.83.66, Local IP: 172.25.251.42
[2025-10-22 12:46:55] [INFO] Restarting GitHub Actions runner...
[2025-10-22 12:46:57] [SUCCESS] GitHub Actions runner restarted successfully
[2025-10-22 12:46:58] [INFO] Staging environment accessible (HTTP 403)
```

## 🔔 Desktop Notifications (Optional)

To enable desktop notifications when VPN disconnects/reconnects:

1. Install terminal-notifier:
```bash
brew install terminal-notifier
```

2. Restart the service:
```bash
launchctl unload ~/Library/LaunchAgents/com.mafid.vpn-auto-reconnect.plist
launchctl load ~/Library/LaunchAgents/com.mafid.vpn-auto-reconnect.plist
```

## 🚨 Troubleshooting

### Service Not Running
```bash
# Check for errors
cat ~/Library/Logs/vpn-auto-reconnect-stderr.log

# Try manual run to see errors
~/vpn-auto-reconnect.sh
```

### VPN Won't Reconnect
- Check VPN credentials are saved in Keychain
- Verify VPN name is correct: `scutil --nc list`
- Check network connectivity
- Try manual VPN connection: `scutil --nc start "AmmanOfficeVPN"`

### Runner Not Restarting
```bash
# Check runner service
cd ~/actions-runner && ./svc.sh status

# Check runner logs
tail -50 ~/Library/Logs/actions.runner.majidalfuttaim-MpassUIRegressionTest.mac-vpn-runner/stdout.log
```

### Logs Growing Too Large
Logs auto-rotate at 10MB. To manually clear:
```bash
rm ~/Library/Logs/vpn-auto-reconnect.log
rm ~/Library/Logs/vpn-auto-reconnect-*.log
```

## 📍 Important Notes

1. **VPN Credentials**: Ensure VPN password is saved in macOS Keychain so it can auto-connect without prompting

2. **Network Changes**: Service will automatically reconnect when:
   - WiFi network changes
   - Computer wakes from sleep
   - Network disconnects temporarily

3. **Runner Restart**: After VPN reconnects, the GitHub Actions runner is restarted to ensure it reconnects to GitHub

4. **Startup Behavior**: Service starts automatically when you log in to macOS

## 🎯 Benefits

✅ **Zero Manual Intervention**: VPN stays connected automatically  
✅ **CI/CD Reliability**: GitHub Actions runner maintains connectivity  
✅ **Complete Logging**: Full audit trail of all VPN events  
✅ **Staging Access**: Tests always have access to staging environment  
✅ **Background Operation**: Runs silently without interrupting work

## 📞 Quick Reference Commands

```bash
# Check service status
launchctl list | grep vpn-auto-reconnect

# View logs (live)
tail -f ~/Library/Logs/vpn-auto-reconnect.log

# Restart service
launchctl unload ~/Library/LaunchAgents/com.mafid.vpn-auto-reconnect.plist
launchctl load ~/Library/LaunchAgents/com.mafid.vpn-auto-reconnect.plist

# Check VPN
scutil --nc status "AmmanOfficeVPN"

# Check runner
cd ~/actions-runner && ./svc.sh status
```

---

**Service Successfully Installed**: October 22, 2025  
**Status**: ✅ Active and Monitoring
