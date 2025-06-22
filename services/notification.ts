import { Notification } from '../types';
import { apiService } from './api';
import { WS_URL } from '@/config';

interface WebSocketMessage {
  type: string;
  data?: any;
  notification?: Notification;
}

type Listener = (data: any) => void;

class NotificationService {
  private static instance: NotificationService;
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout = 5000; // 5 seconds
  private userId: string | null = null;
  private userType: string | null = null;
  private listeners: { [event: string]: Listener[] } = {};

  private constructor() {}

  public on(event: string, listener: Listener) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(listener);
  }

  public off(event: string, listener: Listener) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter(l => l !== listener);
  }

  private emit(event: string, data: any) {
    if (!this.listeners[event]) return;
    this.listeners[event].forEach(listener => listener(data));
  }

  public initialize() {
    if (typeof window !== 'undefined') {
      this.setupWebSocket();
    }
  }

  public cleanup() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  public setUserContext(userId: string, userType: 'driver' | 'passenger') {
    this.userId = userId;
    this.userType = userType;
    
    // Reconnect with new user context if WebSocket is already connected
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.close();
      this.setupWebSocket();
    }
  }

  private setupWebSocket() {
    if (!this.userId || !this.userType) {
      // console.log('User context not set. Skipping WebSocket connection.');
      return;
    }

    try {
      // Close existing connection if any
      if (this.ws) {
        this.ws.close();
        this.ws = null;
      }

      // Add connection parameters to URL instead of sending them after connection
      const wsUrl = `${WS_URL}?user_id=${this.userId}&user_type=${this.userType}`;
      
      // console.log('Attempting WebSocket connection to:', wsUrl);
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        // console.log('WebSocket connection established');
        this.reconnectAttempts = 0;
      };

      this.ws.onmessage = (event: MessageEvent) => {
        try {
          const data = JSON.parse(event.data) as WebSocketMessage;
          this.handleWebSocketMessage(data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      this.ws.onerror = (error: Event) => {
         console.error('WebSocket error:', error);
        // Don't attempt to reconnect on auth errors
        if ((error as any)?.code === 1008) {
          console.error('Authentication failed, not attempting reconnection');
          return;
        }
        this.handleReconnection();
      };

      this.ws.onclose = (event) => {
         console.log('WebSocket connection closed:', event.code, event.reason);
        // Don't attempt to reconnect on auth errors
        if (event.code === 1008) {
          // console.error('Authentication failed, not attempting reconnection');
          return;
        }
        this.handleReconnection();
      };
    } catch (error) {
      console.error('Error setting up WebSocket:', error);
      this.handleReconnection();
    }
  }

  private handleReconnection() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
       console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
      setTimeout(() => this.setupWebSocket(), this.reconnectTimeout);
    } else {
       console.log('Max reconnection attempts reached');
    }
  }

  private handleWebSocketMessage(message: WebSocketMessage) {
    switch (message.type) {
      case 'new_booking':
        this.handleNewBooking(message.data);
        break;
      case 'booking_update':
        this.handleBookingUpdate(message.data);
        break;
      case 'driver_location':
        this.handleDriverLocation(message.data);
        break;
      case 'new_notification':
        this.handleNewNotification(message.notification!);
        break;
      default:
         console.log('Unknown message type:', message.type);
    }
  }

  private handleNewBooking(data: any) {
    if (this.userType === 'driver') {
      this.emit('new_booking', data);
    }
  }

  private handleBookingUpdate(data: any) {
    this.emit('booking_update', data);
  }

  private handleDriverLocation(data: any) {
    if (this.userType === 'passenger') {
      this.emit('driver_location', data);
    }
  }

  private handleNewNotification(notification: Notification) {
    this.emit('new_notification', notification);
  }

  public sendMessage(type: string, data: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, data }));
    } else {
      console.error('WebSocket is not connected');
    }
  }

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  public async sendNotification(
    userId: string,
    userType: string,
    title: string,
    message: string,
    type: Notification['type']
  ): Promise<Notification> {
    const notification = await apiService.sendNotification(userId, userType, title, message, type);
    this.sendMessage('new_notification', { notification });
    return notification;
  }

  public async getNotifications(userId: string, userType: string): Promise<Notification[]> {
    return apiService.getNotifications(userType, userId);
  }

  public async getUnreadNotifications(userId: string, userType: string): Promise<Notification[]> {
    const notifications = await this.getNotifications(userId, userType);
    return notifications.filter(notification => !notification.read);
  }

  public async markAsRead(userId: string, notificationId: string): Promise<void> {
    await apiService.markNotificationRead(notificationId);
  }

  public async markAllAsRead(userId: string, userType: string): Promise<void> {
    await apiService.markAllNotificationsRead(userId, userType);
  }

  public updateDriverLocation(driverId: string, location: { lat: number; lng: number }) {
    this.sendMessage('location_update', {
      driver_id: driverId,
      location
    });
  }

  public updateBookingStatus(bookingId: string, status: string) {
    this.sendMessage('booking_update', {
      booking_id: bookingId,
      status
    });
  }

  public broadcastNewBooking(bookingId: string) {
    this.sendMessage('new_booking', {
      booking_id: bookingId
    });
  }

  public async sendWeatherAlert(
    driverId: string,
    weatherCondition: string,
    severity: 'low' | 'medium' | 'high'
  ): Promise<void> {
    await apiService.sendWeatherAlert(driverId, weatherCondition, severity);
  }

  public async sendPromoNotification(
    userId: string,
    userType: string,
    promoTitle: string,
    promoDetails: string
  ): Promise<void> {
    await this.sendNotification(
      userId,
      userType,
      promoTitle,
      promoDetails,
      'promo'
    );
  }

  public async sendBookingNotification(
    userId: string,
    userType: string,
    status: string,
    details: string
  ): Promise<void> {
    await this.sendNotification(
      userId,
      userType,
      `Booking ${status}`,
      details,
      'ride'
    );
  }

  public async sendPaymentNotification(
    userId: string,
    userType: string,
    status: string,
    amount: number
  ): Promise<void> {
    await this.sendNotification(
      userId,
      userType,
      `Payment ${status}`,
      `Your payment of ${amount} has been ${status.toLowerCase()}.`,
      'payment'
    );
  }
}

export const notificationService = NotificationService.getInstance(); 