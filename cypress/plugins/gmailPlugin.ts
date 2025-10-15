import { google } from 'googleapis';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Gmail API Plugin for Cypress
 * 
 * Prerequisites:
 * 1. Go to https://console.cloud.google.com
 * 2. Create a new project or select existing
 * 3. Enable Gmail API
 * 4. Create OAuth 2.0 credentials (Desktop app)
 * 5. Download credentials and save as credentials.json in project root
 * 6. Run: node cypress/plugins/generateToken.js (to generate token.json)
 */

interface GmailMessage {
  id: string;
  subject: string;
  from: string;
  body: string;
  html: string;
  date: Date;
}

export class GmailAPI {
  private gmail: any;

  constructor() {
    this.gmail = null;
  }

  /**
   * Initialize Gmail API with OAuth2 credentials
   */
  async initialize() {
    const credentialsPath = path.join(process.cwd(), 'credentials.json');
    const tokenPath = path.join(process.cwd(), 'token.json');

    if (!fs.existsSync(credentialsPath)) {
      throw new Error(
        'credentials.json not found. Please download OAuth credentials from Google Cloud Console'
      );
    }

    const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf-8'));
    const { client_secret, client_id, redirect_uris } = credentials.installed || credentials.web;

    const oAuth2Client = new google.auth.OAuth2(
      client_id,
      client_secret,
      redirect_uris[0]
    );

    if (fs.existsSync(tokenPath)) {
      const token = JSON.parse(fs.readFileSync(tokenPath, 'utf-8'));
      oAuth2Client.setCredentials(token);
    } else {
      throw new Error(
        'token.json not found. Run: node cypress/plugins/generateToken.js to authenticate'
      );
    }

    this.gmail = google.gmail({ version: 'v1', auth: oAuth2Client });
  }

  /**
   * Get verification email for a specific email address
   */
  async getVerificationEmail(
    emailAddress: string,
    maxRetries: number = 10,
    retryDelay: number = 3000
  ): Promise<{ link: string; message: GmailMessage } | null> {
    if (!this.gmail) {
      await this.initialize();
    }

    for (let i = 0; i < maxRetries; i++) {
      try {
        console.log(`[Gmail] Attempt ${i + 1}/${maxRetries}: Checking inbox for ${emailAddress}`);

        // Search for verification emails
        const response = await this.gmail.users.messages.list({
          userId: 'me',
          q: `to:${emailAddress} subject:(verify OR verification OR confirm) is:unread newer_than:5m`,
          maxResults: 5,
        });

        if (response.data.messages && response.data.messages.length > 0) {
          // Get the most recent message
          const messageId = response.data.messages[0].id;
          const message = await this.gmail.users.messages.get({
            userId: 'me',
            id: messageId,
            format: 'full',
          });

          // Parse message
          const parsedMessage = this.parseMessage(message.data);
          
          // Extract verification link
          const verificationLink = this.extractVerificationLink(parsedMessage.html || parsedMessage.body);

          if (verificationLink) {
            console.log(`[Gmail] ✅ Found verification link: ${verificationLink}`);
            
            // Mark as read
            await this.gmail.users.messages.modify({
              userId: 'me',
              id: messageId,
              requestBody: {
                removeLabelIds: ['UNREAD'],
              },
            });

            return { link: verificationLink, message: parsedMessage };
          } else {
            console.log('[Gmail] ⚠️ Email found but no verification link detected');
          }
        } else {
          console.log(`[Gmail] No new verification emails found. Waiting ${retryDelay}ms...`);
        }

        // Wait before retrying
        if (i < maxRetries - 1) {
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
        }
      } catch (error) {
        console.error(`[Gmail] Error fetching email:`, error);
      }
    }

    console.log('[Gmail] ❌ No verification email found after retries');
    return null;
  }

  /**
   * Parse Gmail message data
   */
  private parseMessage(messageData: any): GmailMessage {
    const headers = messageData.payload.headers;
    const subject = headers.find((h: any) => h.name === 'Subject')?.value || '';
    const from = headers.find((h: any) => h.name === 'From')?.value || '';
    const date = new Date(parseInt(messageData.internalDate));

    let body = '';
    let html = '';

    // Extract body
    if (messageData.payload.body.data) {
      body = Buffer.from(messageData.payload.body.data, 'base64').toString('utf-8');
    } else if (messageData.payload.parts) {
      for (const part of messageData.payload.parts) {
        if (part.mimeType === 'text/plain' && part.body.data) {
          body = Buffer.from(part.body.data, 'base64').toString('utf-8');
        }
        if (part.mimeType === 'text/html' && part.body.data) {
          html = Buffer.from(part.body.data, 'base64').toString('utf-8');
        }
      }
    }

    return {
      id: messageData.id,
      subject,
      from,
      body,
      html,
      date,
    };
  }

  /**
   * Extract verification link from email content
   */
  private extractVerificationLink(content: string): string | null {
    // Common patterns for verification links
    const patterns = [
      // HTML href patterns - most common
      /href=["']([^"']*(?:verify|confirm|validation|activate|email|token)[^"']*)["']/gi,
      // Direct URL patterns with verification keywords
      /https?:\/\/[^\s<>"]+(?:verify|confirm|validation|activate|email|token)[^\s<>"]*/gi,
      // Any https URL (broader fallback)
      /https?:\/\/[mafid|progressive][^\s<>"]+/gi,
      // Button/link patterns
      /(?:verify|confirm).*?https?:\/\/[^\s<>"]+/gi,
      // URLs in angle brackets
      /<(https?:\/\/[^>]+)>/gi,
    ];

    for (const pattern of patterns) {
      const matches = content.match(pattern);
      if (matches && matches.length > 0) {
        for (const match of matches) {
          let link = match;
          
          // Clean up the link
          link = link.replace(/href=["']/gi, '');
          link = link.replace(/["'<>]/g, '');
          link = link.replace(/&amp;/g, '&');
          link = link.replace(/&gt;/g, '');
          link = link.replace(/&lt;/g, '');
          link = link.trim();

          // Validate it's a proper URL and not an unsubscribe or similar
          if (link.startsWith('http') && 
              !link.includes('unsubscribe') && 
              !link.includes('privacy') &&
              !link.includes('terms')) {
            console.log(`[Gmail] 🔗 Found potential verification link: ${link}`);
            return link;
          }
        }
      }
    }

    console.log('[Gmail] ⚠️ Could not extract verification link from email');
    return null;
  }

  /**
   * Extract password reset link from email content
   * Looks for links near "Reset password" button or similar patterns
   */
  private extractPasswordResetLink(content: string): string | null {
    // Patterns specifically for password reset links
    const patterns = [
      // Reset password button with href
      /reset.*?password.*?href=["']([^"']+)["']/gi,
      /href=["']([^"']+)["'].*?reset.*?password/gi,
      // Any link with reset/password/forgot in URL
      /href=["']([^"']*(?:reset|forgot|password|change)[^"']*)["']/gi,
      // Direct URLs with reset keywords
      /https?:\/\/[^\s<>"]+(?:reset|forgot|password|change)[^\s<>"]*/gi,
      // Button with tracking/click links (common in email services)
      /href=["']([^"']*(?:tracking|click)[^"']*)["']/gi,
      // Any https URL from majidalfuttaim domain
      /href=["'](https?:\/\/[^"']*majidalfuttaim[^"']*)["']/gi,
      // Broader: any https link in the email
      /href=["'](https?:\/\/[^"']+)["']/gi,
    ];

    for (const pattern of patterns) {
      const matches = content.match(pattern);
      if (matches && matches.length > 0) {
        for (const match of matches) {
          let link = match;
          
          // Extract URL from href attribute
          const hrefMatch = link.match(/href=["']([^"']+)["']/i);
          if (hrefMatch) {
            link = hrefMatch[1];
          }
          
          // Clean up the link
          link = link.replace(/&amp;/g, '&');
          link = link.replace(/&gt;/g, '');
          link = link.replace(/&lt;/g, '');
          link = link.replace(/=3D/g, '=');
          link = link.trim();

          // Validate it's a proper URL and not an unsubscribe or similar
          if (link.startsWith('http') && 
              !link.includes('unsubscribe') && 
              !link.includes('privacy') &&
              !link.includes('terms') &&
              !link.includes('support')) {
            console.log(`[Gmail] 🔗 Found potential reset link: ${link}`);
            return link;
          }
        }
      }
    }

    console.log('[Gmail] ⚠️ Could not extract password reset link from email');
    return null;
  }

  /**
   * Get password reset email for a specific email address
   */
  async getPasswordResetEmail(
    emailAddress: string,
    maxRetries: number = 10,
    retryDelay: number = 3000
  ): Promise<{ link: string; message: GmailMessage } | null> {
    if (!this.gmail) {
      await this.initialize();
    }

    for (let i = 0; i < maxRetries; i++) {
      try {
        console.log(`[Gmail] Attempt ${i + 1}/${maxRetries}: Checking inbox for password reset email to ${emailAddress}`);

        // Search for password reset emails - removed is:unread to check all recent emails
        const response = await this.gmail.users.messages.list({
          userId: 'me',
          q: `to:${emailAddress} (subject:(reset OR forgot OR password) OR from:noreply) newer_than:10m`,
          maxResults: 10,
        });

        if (response.data.messages && response.data.messages.length > 0) {
          console.log(`[Gmail] Found ${response.data.messages.length} potential messages`);
          
          // Check each message to find one with a reset link
          for (const msg of response.data.messages) {
            const messageId = msg.id;
            const message = await this.gmail.users.messages.get({
              userId: 'me',
              id: messageId,
              format: 'full',
            });

            // Parse message
            const parsedMessage = this.parseMessage(message.data);
            console.log(`[Gmail] Checking message: "${parsedMessage.subject}"`);
            
            // Extract reset link using password reset specific patterns
            const resetLink = this.extractPasswordResetLink(parsedMessage.html || parsedMessage.body);

            if (resetLink) {
              console.log(`[Gmail] ✅ Found password reset link: ${resetLink}`);
              
              // Mark as read
              await this.gmail.users.messages.modify({
                userId: 'me',
                id: messageId,
                requestBody: {
                  removeLabelIds: ['UNREAD'],
                },
              });

              return { link: resetLink, message: parsedMessage };
            } else {
              console.log(`[Gmail] ⚠️ No reset link found in this message, checking next...`);
            }
          }
          
          console.log('[Gmail] ⚠️ No reset link found in any of the messages');
        } else {
          console.log(`[Gmail] No new password reset emails found. Waiting ${retryDelay}ms...`);
        }

        // Wait before retrying
        if (i < maxRetries - 1) {
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
        }
      } catch (error) {
        console.error(`[Gmail] Error fetching password reset email:`, error);
      }
    }

    console.log('[Gmail] ❌ No password reset email found after retries');
    return null;
  }

  /**
   * Get password reset verification code (6 digits) from email
   */
  async getPasswordResetCode(
    emailAddress: string,
    maxRetries: number = 10,
    retryDelay: number = 3000
  ): Promise<{ code: string; message: GmailMessage } | null> {
    if (!this.gmail) {
      await this.initialize();
    }

    for (let i = 0; i < maxRetries; i++) {
      try {
        console.log(`[Gmail] Attempt ${i + 1}/${maxRetries}: Checking inbox for password reset code to ${emailAddress}`);

        // Search for password reset emails
        const response = await this.gmail.users.messages.list({
          userId: 'me',
          q: `to:${emailAddress} subject:(reset OR forgot OR password OR code OR verification) is:unread newer_than:5m`,
          maxResults: 5,
        });

        if (response.data.messages && response.data.messages.length > 0) {
          // Get the most recent message
          const messageId = response.data.messages[0].id;
          const message = await this.gmail.users.messages.get({
            userId: 'me',
            id: messageId,
            format: 'full',
          });

          const emailData = this.parseMessage(message.data);
          
          // Extract 6-digit code from email body
          const code = this.extractVerificationCode(emailData);
          
          if (code) {
            console.log(`[Gmail] ✅ Found verification code: ${code}`);
            
            // Mark email as read
            await this.gmail.users.messages.modify({
              userId: 'me',
              id: messageId,
              requestBody: {
                removeLabelIds: ['UNREAD'],
              },
            });

            console.log(`[Gmail] ✅ Code extracted successfully`);
            return { code, message: emailData };
          } else {
            console.log(`[Gmail] ⚠️ Email found but no verification code detected`);
          }
        }

        // Wait before retrying
        if (i < maxRetries - 1) {
          console.log(`[Gmail] Waiting ${retryDelay}ms before retry...`);
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
        }
      } catch (error) {
        console.error(`[Gmail] Error in attempt ${i + 1}:`, error);
      }
    }

    console.log(`[Gmail] ❌ No verification code found after ${maxRetries} attempts`);
    return null;
  }

  /**
   * Extract 6-digit verification code from email body
   */
  private extractVerificationCode(message: GmailMessage): string | null {
    const bodyText = message.body + ' ' + message.html;
    
    // Try different patterns to find 6-digit code
    const patterns = [
      /\b(\d{6})\b/g,                                    // Simple 6 digits
      /code[:\s]+(\d{6})/gi,                             // "code: 123456"
      /verification[:\s]+(\d{6})/gi,                     // "verification: 123456"
      /reset[:\s]+(\d{6})/gi,                            // "reset: 123456"
      /your\s+code\s+is[:\s]+(\d{6})/gi,                // "your code is: 123456"
      /enter[:\s]+(\d{6})/gi,                            // "enter: 123456"
      /use[:\s]+(\d{6})/gi,                              // "use: 123456"
    ];

    for (const pattern of patterns) {
      const matches = bodyText.match(pattern);
      if (matches) {
        for (const match of matches) {
          // Extract just the 6 digits
          const codeMatch = match.match(/\d{6}/);
          if (codeMatch) {
            const code = codeMatch[0];
            console.log(`[Gmail] 🔍 Found potential code: ${code}`);
            return code;
          }
        }
      }
    }

    return null;
  }

  /**
   * Delete all test emails (cleanup)
   */
  async cleanupTestEmails(emailAddress: string) {
    if (!this.gmail) {
      await this.initialize();
    }

    const response = await this.gmail.users.messages.list({
      userId: 'me',
      q: `to:${emailAddress}`,
      maxResults: 100,
    });

    if (response.data.messages && response.data.messages.length > 0) {
      for (const message of response.data.messages) {
        await this.gmail.users.messages.trash({
          userId: 'me',
          id: message.id,
        });
      }
      console.log(`[Gmail] Cleaned up ${response.data.messages.length} test emails`);
    }
  }
}

// Cypress task export
export const gmailTasks = {
  async 'gmail:getVerificationEmail'(args: { email: string; maxRetries?: number; retryDelay?: number }) {
    const gmailAPI = new GmailAPI();
    const result = await gmailAPI.getVerificationEmail(
      args.email,
      args.maxRetries || 10,
      args.retryDelay || 3000
    );
    return result;
  },

  async 'gmail:getPasswordResetEmail'(args: { email: string; maxRetries?: number; retryDelay?: number }) {
    const gmailAPI = new GmailAPI();
    const result = await gmailAPI.getPasswordResetEmail(
      args.email,
      args.maxRetries || 10,
      args.retryDelay || 3000
    );
    return result;
  },

  async 'gmail:getPasswordResetCode'(args: { email: string; maxRetries?: number; retryDelay?: number }) {
    const gmailAPI = new GmailAPI();
    const result = await gmailAPI.getPasswordResetCode(
      args.email,
      args.maxRetries || 10,
      args.retryDelay || 3000
    );
    return result;
  },

  async 'gmail:cleanup'(args: { email: string }) {
    const gmailAPI = new GmailAPI();
    await gmailAPI.cleanupTestEmails(args.email);
    return null;
  },
};
