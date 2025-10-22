#!/bin/bash

################################################################################
# VPN Auto-Reconnection Script for GitHub Actions Runner
# 
# This script monitors the AmmanOfficeVPN connection and automatically
# reconnects if it drops, ensuring the GitHub Actions runner maintains
# connectivity to the staging environment.
#
# Usage:
#   ./vpn-auto-reconnect.sh
#
# To run in background:
#   nohup ./vpn-auto-reconnect.sh > ~/vpn-monitor.log 2>&1 &
#
# To run as a service (recommended):
#   See setup instructions at the bottom of this file
################################################################################

# Configuration
VPN_NAME="AmmanOfficeVPN"
CHECK_INTERVAL=30  # Check every 30 seconds
LOG_FILE="$HOME/Library/Logs/vpn-auto-reconnect.log"
MAX_LOG_SIZE=10485760  # 10MB max log size

# Colors for terminal output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

################################################################################
# Logging function
################################################################################
log() {
    local level=$1
    shift
    local message="$@"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    
    # Rotate log if too large
    if [ -f "$LOG_FILE" ] && [ $(stat -f%z "$LOG_FILE") -gt $MAX_LOG_SIZE ]; then
        mv "$LOG_FILE" "$LOG_FILE.old"
        echo "[$timestamp] [INFO] Log rotated" > "$LOG_FILE"
    fi
    
    # Log to file
    echo "[$timestamp] [$level] $message" >> "$LOG_FILE"
    
    # Log to console with colors
    case $level in
        ERROR)
            echo -e "${RED}[$timestamp] [ERROR] $message${NC}"
            ;;
        SUCCESS)
            echo -e "${GREEN}[$timestamp] [SUCCESS] $message${NC}"
            ;;
        WARN)
            echo -e "${YELLOW}[$timestamp] [WARN] $message${NC}"
            ;;
        INFO)
            echo -e "${BLUE}[$timestamp] [INFO] $message${NC}"
            ;;
        *)
            echo "[$timestamp] $message"
            ;;
    esac
}

################################################################################
# Check if VPN is connected
################################################################################
is_vpn_connected() {
    local status=$(scutil --nc status "$VPN_NAME" | head -n 1)
    if [ "$status" = "Connected" ]; then
        return 0
    else
        return 1
    fi
}

################################################################################
# Get VPN detailed status
################################################################################
get_vpn_status() {
    scutil --nc status "$VPN_NAME" | head -n 1
}

################################################################################
# Connect to VPN
################################################################################
connect_vpn() {
    log INFO "Attempting to connect to $VPN_NAME..."
    
    # Start VPN connection
    scutil --nc start "$VPN_NAME" 2>&1 | tee -a "$LOG_FILE"
    
    # Wait for connection to establish (max 30 seconds)
    local retries=0
    local max_retries=30
    
    while [ $retries -lt $max_retries ]; do
        sleep 1
        if is_vpn_connected; then
            log SUCCESS "VPN connected successfully!"
            
            # Get VPN details
            local vpn_info=$(scutil --nc status "$VPN_NAME")
            local remote_ip=$(echo "$vpn_info" | grep "RemoteAddress" | awk '{print $3}')
            local local_ip=$(echo "$vpn_info" | grep "Addresses" -A 1 | tail -n 1 | awk '{print $3}')
            
            log INFO "VPN Details - Remote: $remote_ip, Local IP: $local_ip"
            
            # Send notification (optional - requires terminal-notifier)
            if command -v terminal-notifier &> /dev/null; then
                terminal-notifier -title "VPN Auto-Reconnect" -message "Connected to $VPN_NAME" -sound default
            fi
            
            return 0
        fi
        retries=$((retries + 1))
    done
    
    log ERROR "Failed to connect to VPN after ${max_retries} seconds"
    return 1
}

################################################################################
# Restart GitHub Actions runner (optional)
################################################################################
restart_runner() {
    log INFO "Restarting GitHub Actions runner..."
    
    local runner_dir="$HOME/actions-runner"
    if [ -d "$runner_dir" ]; then
        cd "$runner_dir"
        
        # Stop runner
        if [ -f "./svc.sh" ]; then
            ./svc.sh stop >> "$LOG_FILE" 2>&1
            sleep 2
            
            # Start runner
            ./svc.sh start >> "$LOG_FILE" 2>&1
            
            if [ $? -eq 0 ]; then
                log SUCCESS "GitHub Actions runner restarted successfully"
            else
                log ERROR "Failed to restart GitHub Actions runner"
            fi
        else
            log WARN "Runner service script not found at $runner_dir/svc.sh"
        fi
    else
        log WARN "Runner directory not found at $runner_dir"
    fi
}

################################################################################
# Test staging environment connectivity
################################################################################
test_staging_connectivity() {
    local staging_url="https://mafid-sit.progressive.majidalfuttaim.com"
    local http_code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "$staging_url")
    
    if [ "$http_code" = "403" ] || [ "$http_code" = "200" ] || [ "$http_code" = "301" ]; then
        log INFO "Staging environment accessible (HTTP $http_code)"
        return 0
    else
        log WARN "Staging environment not accessible (HTTP $http_code)"
        return 1
    fi
}

################################################################################
# Main monitoring loop
################################################################################
monitor_vpn() {
    log INFO "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    log INFO "VPN Auto-Reconnection Monitor Started"
    log INFO "VPN Name: $VPN_NAME"
    log INFO "Check Interval: ${CHECK_INTERVAL}s"
    log INFO "Log File: $LOG_FILE"
    log INFO "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    # Initial VPN check
    if is_vpn_connected; then
        log SUCCESS "VPN is already connected"
        test_staging_connectivity
    else
        log WARN "VPN is not connected. Attempting initial connection..."
        connect_vpn
        if [ $? -eq 0 ]; then
            restart_runner
            test_staging_connectivity
        fi
    fi
    
    # Monitoring loop
    local check_count=0
    local disconnect_count=0
    
    while true; do
        sleep $CHECK_INTERVAL
        check_count=$((check_count + 1))
        
        if is_vpn_connected; then
            # VPN is connected - silent check (only log every 10th check to reduce noise)
            if [ $((check_count % 10)) -eq 0 ]; then
                log INFO "VPN health check #${check_count}: Connected ✓"
            fi
        else
            # VPN is disconnected!
            disconnect_count=$((disconnect_count + 1))
            local vpn_status=$(get_vpn_status)
            
            log ERROR "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
            log ERROR "VPN DISCONNECTED! (Disconnect #${disconnect_count})"
            log ERROR "Status: $vpn_status"
            log ERROR "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
            
            # Send notification (if available)
            if command -v terminal-notifier &> /dev/null; then
                terminal-notifier -title "VPN Disconnected!" -message "Attempting to reconnect..." -sound default
            fi
            
            # Attempt reconnection
            if connect_vpn; then
                log INFO "Waiting 5 seconds before restarting runner..."
                sleep 5
                restart_runner
                test_staging_connectivity
            else
                log ERROR "Reconnection failed. Will retry in ${CHECK_INTERVAL} seconds..."
            fi
        fi
    done
}

################################################################################
# Cleanup on exit
################################################################################
cleanup() {
    log INFO "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    log INFO "VPN Auto-Reconnection Monitor Stopped"
    log INFO "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    exit 0
}

# Trap signals for graceful shutdown
trap cleanup SIGINT SIGTERM

################################################################################
# Script entry point
################################################################################

# Check if running as root (not recommended)
if [ "$EUID" -eq 0 ]; then
    log WARN "Running as root is not recommended. Run as regular user instead."
fi

# Start monitoring
monitor_vpn

################################################################################
# SETUP AS A LAUNCH AGENT (macOS Service)
################################################################################
#
# To run this script automatically on startup as a macOS service:
#
# 1. Make the script executable:
#    chmod +x /Users/baraissa/Documents/Mpass\ automation\ FE/vpn-auto-reconnect.sh
#
# 2. Create a LaunchAgent plist file at:
#    ~/Library/LaunchAgents/com.mafid.vpn-auto-reconnect.plist
#
#    Contents:
#    <?xml version="1.0" encoding="UTF-8"?>
#    <!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
#    <plist version="1.0">
#    <dict>
#        <key>Label</key>
#        <string>com.mafid.vpn-auto-reconnect</string>
#        <key>ProgramArguments</key>
#        <array>
#            <string>/Users/baraissa/Documents/Mpass automation FE/vpn-auto-reconnect.sh</string>
#        </array>
#        <key>RunAtLoad</key>
#        <true/>
#        <key>KeepAlive</key>
#        <true/>
#        <key>StandardOutPath</key>
#        <string>/Users/baraissa/Library/Logs/vpn-auto-reconnect-stdout.log</string>
#        <key>StandardErrorPath</key>
#        <string>/Users/baraissa/Library/Logs/vpn-auto-reconnect-stderr.log</string>
#    </dict>
#    </plist>
#
# 3. Load the service:
#    launchctl load ~/Library/LaunchAgents/com.mafid.vpn-auto-reconnect.plist
#
# 4. Check service status:
#    launchctl list | grep vpn-auto-reconnect
#
# 5. View logs:
#    tail -f ~/Library/Logs/vpn-auto-reconnect.log
#
# 6. To stop the service:
#    launchctl unload ~/Library/LaunchAgents/com.mafid.vpn-auto-reconnect.plist
#
################################################################################
