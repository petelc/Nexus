import * as signalR from '@microsoft/signalr';
import { tokenManager } from './apiClient';

class SignalRClient {
  private connection: signalR.HubConnection | null = null;
  private hubUrl: string;

  constructor() {
    this.hubUrl = import.meta.env.VITE_SIGNALR_HUB_URL || 'http://localhost:5000/hubs/collaboration';
  }

  async connect(): Promise<void> {
    if (this.connection?.state === signalR.HubConnectionState.Connected) {
      console.log('SignalR already connected');
      return;
    }

    const token = tokenManager.getAccessToken();

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(this.hubUrl, {
        accessTokenFactory: () => token || '',
        skipNegotiation: false,
      })
      .withAutomaticReconnect({
        nextRetryDelayInMilliseconds: (retryContext) => {
          // Exponential backoff: 0, 2, 10, 30 seconds
          if (retryContext.elapsedMilliseconds < 60000) {
            return Math.min(1000 * Math.pow(2, retryContext.previousRetryCount), 30000);
          } else {
            return null; // Stop retrying after 1 minute
          }
        },
      })
      .configureLogging(signalR.LogLevel.Information)
      .build();

    // Connection lifecycle events
    this.connection.onreconnecting((error) => {
      console.warn('SignalR reconnecting:', error);
    });

    this.connection.onreconnected((connectionId) => {
      console.log('SignalR reconnected:', connectionId);
    });

    this.connection.onclose((error) => {
      console.error('SignalR connection closed:', error);
    });

    try {
      await this.connection.start();
      console.log('SignalR connected successfully');
    } catch (error) {
      console.error('Error connecting to SignalR:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (this.connection) {
      try {
        await this.connection.stop();
        console.log('SignalR disconnected');
      } catch (error) {
        console.error('Error disconnecting from SignalR:', error);
      } finally {
        this.connection = null;
      }
    }
  }

  on(eventName: string, callback: (...args: any[]) => void): void {
    if (!this.connection) {
      console.warn('Cannot register event handler - not connected');
      return;
    }
    this.connection.on(eventName, callback);
  }

  off(eventName: string, callback?: (...args: any[]) => void): void {
    if (!this.connection) {
      return;
    }
    if (callback) {
      this.connection.off(eventName, callback);
    } else {
      this.connection.off(eventName);
    }
  }

  async invoke<T = any>(methodName: string, ...args: any[]): Promise<T> {
    if (!this.connection || this.connection.state !== signalR.HubConnectionState.Connected) {
      throw new Error('SignalR is not connected');
    }
    return this.connection.invoke<T>(methodName, ...args);
  }

  async send(methodName: string, ...args: any[]): Promise<void> {
    if (!this.connection || this.connection.state !== signalR.HubConnectionState.Connected) {
      throw new Error('SignalR is not connected');
    }
    return this.connection.send(methodName, ...args);
  }

  get connectionState(): signalR.HubConnectionState | null {
    return this.connection?.state || null;
  }

  get isConnected(): boolean {
    return this.connection?.state === signalR.HubConnectionState.Connected;
  }
}

// Export singleton instance
export const signalRClient = new SignalRClient();
export default signalRClient;
