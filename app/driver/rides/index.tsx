import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, Image, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { NetworkProvider, useNetwork } from '@/components/common/NetworkProvider';
import MapComponent from '@/components/common/MapComponent';
import { spacing, typography, borderRadius } from '@/styles/theme';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import FloatingActionButton from '@/components/common/FloatingActionButton';
import { colors } from '@/styles/theme';
import { Menu } from 'lucide-react-native';
import { useRouter } from 'expo-router';

// Define a type for ride request data
interface RideRequest {
    id: string;
    riderName: string;
    rating: number;
    fare: string;
    distance: string;
    pickup: string;
    dropoff: string;
    pickupCoords: { latitude: number; longitude: number };
    dropoffCoords: { latitude: number; longitude: number };
}

function RidesScreen() {
  const [isOnline, setIsOnline] = useState(true);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [rideRequestState, setRideRequestState] = useState('idle'); // 'idle', 'scanning', 'requests_available', 'request_details'
  const [availableRequests, setAvailableRequests] = useState<RideRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<RideRequest | null>(null);
  const networkState = useNetwork();
  const navigation = useNavigation<DrawerNavigationProp<any>>();
  const router = useRouter();

  // Stats data
  const stats = {
    acceptance: 95.0,
    rating: 4.75,
    cancellation: 2.0
  };

  // Route data (simplified for demo)
  const routeCoordinates = [
    { latitude: -1.9440, longitude: 30.0618 }, // Example coordinates (Kigali area)
    { latitude: -1.9500, longitude: 30.0700 },
    { latitude: -1.9550, longitude: 30.0800 },
    { latitude: -1.9600, longitude: 30.0900 },
    { latitude: -1.9650, longitude: 30.1000 },
  ];

  // Route info
  const routeInfo = [
    { time: '56 min', distance: 'km', position: 'top' },
    { time: '58 min', distance: '24.4 km', position: 'middle' },
    { time: '56 min', distance: '25 km', position: 'bottom' },
  ];

  useEffect(() => {
    // Auto-switch to offline mode when network is disconnected
    if (!networkState.isConnected) {
      setIsOnline(false);
    }

    // Request location permissions
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, [networkState.isConnected]);

  const toggleOnlineStatus = () => {
    // Only allow going online if network is connected
    if (!isOnline && !networkState.isConnected) {
      // Could show an alert here that network is required to go online
      return;
    }
    setIsOnline(!isOnline);
  };

  const handleHailRide = () => {
    setRideRequestState('scanning');
    // TODO: Implement actual scanning logic (e.g., API call to fetch requests)

    // Simulate finding requests after a delay
    setTimeout(() => {
      const dummyRequests: RideRequest[] = [
        {
            id: '1',
            riderName: 'Akuzwe G.',
            rating: 4,
            fare: '1500 Rwf',
            distance: '11.1Km',
            pickup: 'KG 11 Ave',
            dropoff: 'KK 3Rd/RN3',
            pickupCoords: { latitude: -1.9580, longitude: 30.0680 }, // Example pickup coordinate
            dropoffCoords: { latitude: -1.9400, longitude: 30.0500 }, // Example dropoff coordinate
        },
         {
            id: '2',
            riderName: 'Jane Doe',
            rating: 5,
            fare: '2000 Rwf',
            distance: '15.5Km',
            pickup: 'Kigali Heights',
            dropoff: 'Kigali Convention Centre',
            pickupCoords: { latitude: -1.9650, longitude: 30.0900 }, // Example pickup coordinate
            dropoffCoords: { latitude: -1.9300, longitude: 30.0700 }, // Example dropoff coordinate
        },
      ];
      setAvailableRequests(dummyRequests);
      setRideRequestState('requests_available');
    }, 3000); // Simulate scanning time
  };

  const handleMarkerPress = (request: RideRequest) => {
    setSelectedRequest(request);
    setRideRequestState('request_details');
  };

  const handleReject = () => {
      setSelectedRequest(null);
      setRideRequestState('scanning'); // Go back to scanning for other requests
       // Or set to 'idle' if you only want to scan once per hail
  };

  const handleAccept = () => {
      if(selectedRequest) {
           // TODO: Implement logic to accept the ride request (e.g., API call)
           console.log('Accepted ride:', selectedRequest);
           // Navigate to the navigate-pickup screen with ride data
           router.push({
             pathname: '/driver/rides/navigate-pickup',
             params: { rideData: JSON.stringify(selectedRequest) },
           });
            // Reset state after accepting
            setRideRequestState('idle');
            setAvailableRequests([]);
            setSelectedRequest(null);
      }
  };

  const renderRideRequestDetails = () => {
      if (!selectedRequest) return null;

      return (
           <View style={styles.rideRequestContainer}>
                <View style={styles.rideRequestHeader}>
                    <Text style={styles.rideRequestTitle}>Ride Request</Text>
                </View>
               
                <View style={styles.riderInfo}>
                    {/* Replace with actual rider image */}
                     <Image source={{ uri: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-05-02%20215507-YaoGHTbbSX0Yy08KmjYtLH34ltoiYQ.png' }} style={styles.riderImage} />
                    <View style={styles.riderDetails}>
                        <Text style={styles.riderName}>{selectedRequest.riderName}</Text>
                         <View style={styles.ratingContainer}>
                            {[...Array(selectedRequest.rating)].map((_, index) => (
                                <FontAwesome key={index} name="star" size={16} color={colors.primary.main} />
                            ))}
                             {[...Array(5 - selectedRequest.rating)].map((_, index) => (
                                <FontAwesome key={index + selectedRequest.rating} name="star-o" size={16} color={colors.primary.main} />
                            ))}
                        </View>
                    </View>
                </View>

                 <View style={styles.rideRequestInfo}>
                    <View style={styles.infoRow}>
                         <FontAwesome name="money" size={18} color={colors.text.primary} />
                         <Text style={styles.infoText}>{selectedRequest.fare}</Text>
                     </View>
                     <View style={styles.infoRow}>
                         <FontAwesome name="road" size={18} color={colors.text.primary} />
                         <Text style={styles.infoText}>{selectedRequest.distance}</Text>
                     </View>
                 </View>


                <View style={styles.locationInfo}>
                    <Text style={styles.locationLabel}>Pickup</Text>
                    <Text style={styles.locationText}>{selectedRequest.pickup}</Text>
                    <Text style={styles.locationLabel}>Dropoff</Text>
                    <Text style={styles.locationText}>{selectedRequest.dropoff}</Text>
                </View>


                <View style={styles.buttonContainer}>
                     <TouchableOpacity style={[styles.actionButton, styles.rejectButton]} onPress={handleReject}>
                         <Text style={styles.actionButtonText}>Reject</Text>
                     </TouchableOpacity>
                     <TouchableOpacity 
                        style={[styles.actionButton, styles.acceptButton]} 
                        onPress={handleAccept}
                      >
                         <Text style={styles.actionButtonText}>Accept</Text>
                     </TouchableOpacity>
                </View>
           </View>
      );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      {errorMsg ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{errorMsg}</Text>
        </View>
      ) : (
        <>
          <MapComponent 
            routeCoordinates={routeCoordinates}
            currentLocation={location?.coords ? {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude
            } : null}
            markers={rideRequestState === 'requests_available' ? availableRequests.map(request => ({
              id: request.id,
              coordinate: {
                latitude: request.pickupCoords.latitude,
                longitude: request.pickupCoords.longitude
              },
              title: request.riderName,
              description: `Fare: ${request.fare}, Distance: ${request.distance}`,
              onPress: () => handleMarkerPress(request)
            })) : []}
          />
          
          {/* Top Info Bar */}
          <View style={styles.topInfoContainer}>
            <View style={styles.hamburgerContainer}>
             <FloatingActionButton
             icon={<Menu color={colors.text.primary} size={24} />}
             position="top-left"
             backgroundColor={colors.background.paper}
             onPress={() => navigation.openDrawer()}
             style={styles.menuButton}
           />
            </View>
            
            {/* Time and Distance Box (conditionally visible) */}
            {rideRequestState !== 'requests_available' && rideRequestState !== 'request_details' && (
            <View style={styles.timeDistanceBox}>
              <View style={styles.carIconContainer}>
                <Ionicons name="car" size={18} color="#555" />
              </View>
              <View>
                <Text style={styles.timeText}>{routeInfo[0].time}</Text>
                <Text style={styles.distanceText}>{routeInfo[0].distance}</Text>
              </View>
            </View>
            )}
            
            <TouchableOpacity style={styles.profileButton}>
              <Image 
                source={{ uri: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-05-02%20215507-YaoGHTbbSX0Yy08KjuYtLH34ltoiYQ.png' }} 
                style={styles.profileImage}
              />
            </TouchableOpacity>
          </View>
          
          {/* Middle Info Box (conditionally visible) */}
          {rideRequestState !== 'requests_available' && rideRequestState !== 'request_details' && (
          <View style={styles.middleInfoBox}>
            <View style={styles.carIconContainer}>
              <Ionicons name="car" size={18} color="#555" />
            </View>
            <View>
              <Text style={styles.timeText}>{routeInfo[1].time}</Text>
              <Text style={styles.distanceText}>{routeInfo[1].distance}</Text>
            </View>
          </View>
          )}
          
          {/* Bottom Info Box (conditionally visible) */}
           {rideRequestState !== 'requests_available' && rideRequestState !== 'request_details' && (
          <View style={styles.bottomInfoBox}>
            <View style={styles.carIconContainer}>
              <Ionicons name="car" size={18} color="#555" />
            </View>
            <View>
              <Text style={styles.timeText}>{routeInfo[2].time}</Text>
              <Text style={styles.distanceText}>{routeInfo[2].distance}</Text>
            </View>
          </View>
          )}
          
          {/* Status Buttons / Hail Ride / Scanning (conditionally visible) */}
          <View style={styles.statusButtonsContainer}>
            <TouchableOpacity 
              style={[styles.statusButton, { backgroundColor: '#000' }]}
              onPress={toggleOnlineStatus}
            >
              <FontAwesome name="user" size={20} color="#FFD700" />
              <Text style={styles.statusText}>{isOnline ? 'Online' : 'Offline'}</Text>
            </TouchableOpacity>
            
            {rideRequestState === 'idle' && isOnline && (
               <TouchableOpacity style={styles.hailRideButton} onPress={handleHailRide}>
              <Text style={styles.hailRideText}>Hail Ride</Text>
            </TouchableOpacity>
            )}
            
            {rideRequestState === 'scanning' && (
                 <View style={styles.scanningContainer}>
                      <Text style={styles.scanningText}>Scanning...</Text>
                 </View>
            )}

            {/* Zoom Button (always visible) */}
            <TouchableOpacity style={styles.zoomButton}>
              <Ionicons name="locate" size={24} color="#555" />
            </TouchableOpacity>
          </View>
          
          {/* Bottom Panel (conditionally visible) */}
          {rideRequestState === 'idle' && (
          <View style={styles.bottomPanel}>
            <View style={styles.bottomPanelHandle} />
            
            <Text style={[
              styles.connectionStatus, 
              { color: isOnline ? '#FFD700' : 'white' }
            ]}>
              {isOnline 
                ? "You're back Online" 
                : "You are currently offline"}
            </Text>
            
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <View style={styles.statIconContainer}>
                  <FontAwesome name="check" size={20} color="#FFD700" />
                </View>
                <Text style={styles.statValue}>{stats.acceptance}%</Text>
                <Text style={styles.statLabel}>Acceptance</Text>
              </View>
              
              <View style={styles.statDivider} />
              
              <View style={styles.statItem}>
                <View style={styles.statIconContainer}>
                  <FontAwesome name="star" size={20} color="#FFD700" />
                </View>
                <Text style={styles.statValue}>{stats.rating}</Text>
                <Text style={styles.statLabel}>Rating</Text>
              </View>
              
              <View style={styles.statDivider} />
              
              <View style={styles.statItem}>
                <View style={styles.statIconContainer}>
                  <FontAwesome name="times" size={20} color="#FF0000" />
                </View>
                <Text style={styles.statValue}>{stats.cancellation}%</Text>
                <Text style={styles.statLabel}>Cancellation</Text>
              </View>
            </View>
          </View>
          )}
          
          {/* Ride Request Details View (conditionally rendered as a bottom sheet) */}
          {rideRequestState === 'request_details' && renderRideRequestDetails()}
        </>
      )}
    </SafeAreaView>
  );
}

// Add error styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: spacing.md
  },
  menuButton: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  topInfoContainer: {
    position: 'absolute',
    top: 50,
    left: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  hamburgerContainer: {
    position: 'relative',
    width: 40,
    height: 40,
  },
  timeDistanceBox: {
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  carIconContainer: {
    marginRight: 8,
  },
  timeText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  distanceText: {
    fontSize: 14,
    color: '#555',
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'white',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  middleInfoBox: {
    position: 'absolute',
    left: 20,
    top: '50%',
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  bottomInfoBox: {
    position: 'absolute',
    right: 20,
    bottom: 250,
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  statusButtonsContainer: {
    position: 'absolute',
    bottom: 180,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  statusButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 14
  },
  statusText: {
    color: '#FFD700',
    marginTop: 4,
    fontSize: 12,
    fontFamily: typography.fontFamily.bold
  },
  hailRideButton: {
    backgroundColor: '#000',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginHorizontal: 20,
  },
  hailRideText: {
    color: 'white',
    fontFamily: typography.fontFamily.bold
  },
   scanningContainer: {
        backgroundColor: '#000',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 20,
        marginHorizontal: 20,
   },
   scanningText: {
    color: 'white',
    fontFamily: typography.fontFamily.bold
  },
  zoomButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  bottomPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#000',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    paddingVertical: 20,
    paddingHorizontal: 15,
    alignItems: 'center',
  },
  bottomPanelHandle: {
    width: 40,
    height: 5,
    backgroundColor: '#555',
    borderRadius: 3,
    marginBottom: 15,
  },
  connectionStatus: {
    fontSize: 18,
    fontFamily: typography.fontFamily.bold,
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statIconContainer: {
    marginBottom: 5,
  },
  statValue: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  statLabel: {
    color: 'white',
    fontSize: 14,
    fontFamily: typography.fontFamily.medium
  },
  statDivider: {
    width: 1,
    height: '100%',
    backgroundColor: '#333',
  },
   rideRequestContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: colors.background.paper,
        borderTopLeftRadius: borderRadius.xl,
        borderTopRightRadius: borderRadius.xl,
        padding: spacing.xl,
   },
    rideRequestHeader: {
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    rideRequestTitle: {
        fontFamily: typography.fontFamily.bold,
        fontSize: typography.fontSize.xl,
        color: colors.text.primary,
    },
    riderInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    riderImage: {
        width: 60,
        height: 60,
        borderRadius: borderRadius.full,
        marginRight: spacing.md,
    },
    riderDetails: {
        flex: 1,
    },
    riderName: {
        fontFamily: typography.fontFamily.semiBold,
        fontSize: typography.fontSize.lg,
        color: colors.text.primary,
        marginBottom: spacing.xs,
    },
     ratingContainer: {
        flexDirection: 'row',
     },
     rideRequestInfo: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: spacing.md
     },
     infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm
     },
     infoText: {
        fontFamily: typography.fontFamily.medium,
        fontSize: typography.fontSize.md,
        color: colors.text.primary,
     },
     locationInfo: {
        marginBottom: spacing.xl
     },
     locationLabel: {
        fontFamily: typography.fontFamily.medium,
        fontSize: typography.fontSize.sm,
        color: colors.text.secondary,
        marginBottom: spacing.xs,
     },
     locationText: {
        fontFamily: typography.fontFamily.semiBold,
        fontSize: typography.fontSize.md,
        color: colors.text.primary,
        marginBottom: spacing.md
     },
     buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
     },
     actionButton: {
        flex: 1,
        paddingVertical: spacing.md,
        borderRadius: borderRadius.md,
        alignItems: 'center',
     },
     actionButtonText: {
        fontFamily: typography.fontFamily.bold,
        fontSize: typography.fontSize.lg,
        color: colors.primary.contrastText,
     },
      rejectButton: {
        backgroundColor: colors.error.main,
        marginRight: spacing.md
      },
      acceptButton: {
        backgroundColor: colors.primary.main,
      },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  errorText: {
    color: colors.error.main,
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSize.md,
    textAlign: 'center',
  },
});

export default RidesScreen;