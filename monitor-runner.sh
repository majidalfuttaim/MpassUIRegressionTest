#!/bin/bash

# GitHub Actions Self-Hosted Runner Monitoring Script
# Usage: ./monitor-runner.sh

echo "═══════════════════════════════════════════════════════════"
echo "   GitHub Actions Runner Status Monitor"
echo "═══════════════════════════════════════════════════════════"
echo ""

# Runner directory
RUNNER_DIR=~/actions-runner
LOG_DIR=~/Library/Logs/actions.runner.majidalfuttaim-MpassUIRegressionTest.mac-vpn-runner

# Check if runner is installed
if [ ! -d "$RUNNER_DIR" ]; then
    echo "❌ Runner directory not found: $RUNNER_DIR"
    exit 1
fi

# 1. Runner Service Status
echo "📊 Runner Service Status:"
echo "────────────────────────────────────────────────────────────"
cd "$RUNNER_DIR" && ./svc.sh status
echo ""

# 2. VPN Connection Status
echo "🔐 VPN Connection Status:"
echo "────────────────────────────────────────────────────────────"
VPN_STATUS=$(scutil --nc status "AmmanOfficeVPN" | head -1)
if [ "$VPN_STATUS" = "Connected" ]; then
    echo "✅ VPN Connected: AmmanOfficeVPN"
    VPN_IP=$(scutil --nc status "AmmanOfficeVPN" | grep "RemoteAddress" | awk '{print $3}')
    echo "   Server: $VPN_IP"
else
    echo "❌ VPN Disconnected"
    echo "   ⚠️  Runner needs VPN to access staging environment!"
    echo "   To connect: scutil --nc start \"AmmanOfficeVPN\""
fi
echo ""

# 3. Staging Environment Connectivity
echo "🌐 Staging Environment Connectivity:"
echo "────────────────────────────────────────────────────────────"
STAGING_URL="https://mafid-sit.progressive.majidalfuttaim.com"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time 5 "$STAGING_URL" 2>/dev/null)
if [ "$HTTP_CODE" = "403" ] || [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Staging accessible: $STAGING_URL"
    echo "   HTTP Status: $HTTP_CODE"
elif [ -z "$HTTP_CODE" ]; then
    echo "❌ Cannot reach staging environment"
    echo "   Check VPN connection!"
else
    echo "⚠️  Staging returned: HTTP $HTTP_CODE"
fi
echo ""

# 4. Recent Runner Activity
echo "📋 Recent Runner Activity (Last 20 lines):"
echo "────────────────────────────────────────────────────────────"
if [ -f "$LOG_DIR/stdout.log" ]; then
    tail -20 "$LOG_DIR/stdout.log" | grep -E "Listening|Running|job|Finished|error|Error|Connected" || echo "No recent activity"
else
    echo "❌ Log file not found: $LOG_DIR/stdout.log"
fi
echo ""

# 5. Current Jobs
echo "🚀 Current Jobs:"
echo "────────────────────────────────────────────────────────────"
CURRENT_JOB=$(tail -50 "$LOG_DIR/stdout.log" 2>/dev/null | grep "Running job:" | tail -1)
if [ -n "$CURRENT_JOB" ]; then
    echo "   $CURRENT_JOB"
else
    echo "   No jobs currently running (Idle)"
fi
echo ""

# 6. System Resources
echo "💻 System Resources:"
echo "────────────────────────────────────────────────────────────"
# Find runner process
RUNNER_PID=$(ps aux | grep "Runner.Listener" | grep -v grep | awk '{print $2}')
if [ -n "$RUNNER_PID" ]; then
    echo "   Runner PID: $RUNNER_PID"
    ps -p "$RUNNER_PID" -o %cpu,%mem,rss,time | tail -1 | awk '{printf "   CPU: %s%% | Memory: %s%% (%s KB) | Runtime: %s\n", $1, $2, $3, $4}'
else
    echo "   ⚠️  Runner process not found"
fi
echo ""

# 7. Quick Commands
echo "⚡ Quick Commands:"
echo "────────────────────────────────────────────────────────────"
echo "   Restart runner:  cd ~/actions-runner && ./svc.sh restart"
echo "   Stop runner:     cd ~/actions-runner && ./svc.sh stop"
echo "   View live logs:  tail -f $LOG_DIR/stdout.log"
echo "   Connect VPN:     scutil --nc start \"AmmanOfficeVPN\""
echo "   Check errors:    tail -100 $LOG_DIR/stderr.log"
echo ""

echo "═══════════════════════════════════════════════════════════"
echo "GitHub Actions: https://github.com/majidalfuttaim/MpassUIRegressionTest/actions"
echo "Runner Settings: https://github.com/majidalfuttaim/MpassUIRegressionTest/settings/actions/runners"
echo "═══════════════════════════════════════════════════════════"
